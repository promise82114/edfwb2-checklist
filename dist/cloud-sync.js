// Checklist adapter: automatic sync while the in-memory grant is valid.
(function(global){
 'use strict';
 const $=id=>document.getElementById(id),config=global.SIDE_PROJECT_CLOUD_CONFIG,local=global.EDF_CHECKLIST_STORAGE;
 let ready=false,busy=false,remote=null,reviewed=false,connectedBefore=false,expired=false;
 let session=0,timer,lastSync=0,synced=null,paused=false,problem='',syncing=false;
 const auth=new global.SideProjectAuth.GoogleAuth(config.clientId,()=>{
  if(!auth.connected&&connectedBefore){expired=true;reviewed=false;remote=null;clearTimeout(timer);}
  if(connectedBefore&&auth.info.reason==='expired')message('Google 授權期限已到，請重新授權；未同步變更仍保留在本機。');
  if(connectedBefore&&auth.info.reason==='rejected')message('Google 提前拒絕目前授權（401），請重新授權；本機進度仍保留。');
  render();
 });
 const drive=new global.SideProjectDrive.DriveAppData(auth,config.fileName);
 const automatic=()=>$('cloudAuto').checked;
 function fingerprint(data){return JSON.stringify(['entries','favorites','content','missionNotes'].map(key=>Object.entries(data[key]||{}).sort(([a],[b])=>a.localeCompare(b))));}
 function dirty(){try{return fingerprint(local.get())!==synced;}catch{return true;}}
 function message(text){$('cloudStatus').textContent=text;}
 function render(){
  const info=auth.info,time=value=>new Date(value).toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  $('cloudAuthStatus').textContent=auth.connected?`本次授權 ${info.lifetimeSeconds} 秒，於 ${time(info.issuedAt)} 取得，${time(info.expiresAt)} 到期。`:
   info.reason==='rejected'?`Google 拒絕授權（401）；原定 ${time(info.expiresAt)} 到期。請重新授權。`:
   info.reason==='expired'&&info.expiresAt?`授權已於 ${time(info.expiresAt)} 到期（本次 ${info.lifetimeSeconds} 秒）。請重新授權。`:
   '授權只保留在此頁面；重新整理或重開後需再次連接。';
  if(!reviewed)$('cloudRemoteSummary').textContent='尚未讀取';
  $('cloudConnect').disabled=busy;
  $('cloudConnect').textContent=busy?'處理中…':!ready?'載入 Google 授權服務':expired?'重新授權 Google Drive':auth.connected?'切換 Google 帳號':'連接 Google Drive';
  $('cloudDisconnect').hidden=!auth.connected;$('cloudDisconnect').disabled=busy;
  $('cloudUpload').disabled=busy||!auth.connected;$('cloudRead').disabled=busy||!auth.connected;
  $('cloudChoices').hidden=!reviewed||!remote||!auth.connected;
  for(const id of ['cloudMerge','cloudReplace'])$(id).disabled=busy;
  let text=expired?'雲端需重新授權':!auth.connected?'雲端未連接':busy?'雲端同步中…':!navigator.onLine?'雲端待同步 · 離線':paused?'雲端同步已暫停':problem?'雲端待重試':dirty()?'雲端待同步':lastSync?'雲端已同步 '+new Date(lastSync).toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'}):'雲端已連接';
  if(auth.connected&&!automatic()&&!busy)text+=' · 自動同步關閉';
  $('cloudQuick').textContent=text;$('cloudQuick').classList.toggle('error',expired||paused||!!problem);$('cloudQuick').title=problem||'查看 Google Drive 同步狀態';
 }
 function schedule(delay=5000){clearTimeout(timer);render();if(automatic()&&auth.connected&&!paused)timer=setTimeout(()=>sync(),delay);}
 function summarize(data){const count=(key,field)=>Object.values(data[key]||{}).filter(e=>e[field]).length;return `${count('entries','owned')} 項已取得 · ${count('favorites','favorite')} 關收藏 · ${count('content','enabled')} 項額外內容 · ${count('missionNotes','text')} 則筆記`;}
 function showReview(){ $('cloudLocalSummary').textContent=summarize(local.get());$('cloudRemoteSummary').textContent=remote?summarize(remote.data)+' · '+new Date(remote.value.updatedAt).toLocaleString('zh-TW'):'尚無雲端進度';}
 function checkSession(expected){if(expected!==session||!auth.connected)throw Object.assign(Error('連接已變更，本次操作已停止。'),{code:'cancelled'});}
 async function read(expected=session){
  reviewed=false;remote=null;render();const loaded=await drive.read();checkSession(expected);
  if(loaded){const validated=global.SideProjectProgress.unpack(loaded.value,config.projectId,local.validate);if(validated.unknown)throw Object.assign(Error('雲端含目前版本無法辨識的項目，已暫停同步，請更新網站。'),{code:'invalid'});remote={...loaded,data:validated.data};}
  reviewed=true;showReview();
 }
 async function run(action){
  if(busy)return;busy=true;render();
  try{await action();problem='';}catch(e){
   if(e.code==='cancelled')return;
   problem=e.message||'雲端操作失敗，本機進度仍保留。';
   if(e.code==='expired'){expired=true;reviewed=false;remote=null;}
   if(e.code==='conflict'){reviewed=false;remote=null;}
   paused=!['drive','conflict','expired'].includes(e.code);
   message(problem+(auth.connected&&!paused?' 將於稍後重試。':''));
  }finally{busy=false;render();}
 }
 async function sync(){
  if(busy){schedule();return;}if(!auth.connected||!navigator.onLine){render();return;}
  const expectedSession=session;clearTimeout(timer);
  await run(async()=>{
   syncing=true;
   try{
    for(let attempt=0;attempt<3;attempt++){
     try{
      await read(expectedSession);checkSession(expectedSession);if(remote)local.reconcile(remote.data);
      const data=local.get(),signature=fingerprint(data);
      if(!remote||signature!==fingerprint(remote.data)){
       const expected=remote;reviewed=false;remote=null;checkSession(expectedSession);
       await drive.write(global.SideProjectProgress.pack(config.projectId,data),expected);checkSession(expectedSession);
       // Verify the actual stored content, including when ETag is unavailable.
       await read(expectedSession);
       if(!remote||signature!==fingerprint(remote.data))throw Object.assign(Error('寫入後雲端進度有變更，將重新合併同步。'),{code:'conflict'});
      }
      synced=signature;lastSync=Date.now();paused=false;problem='';$('cloudLocalSummary').textContent=summarize(local.get());message('已同步至 Google Drive。'+(dirty()?'仍有新變更等待同步。':''));return;
     }catch(e){if(e.code!=='conflict'||attempt===2)throw e;}
    }
   }finally{syncing=false;}
  });
  if(expectedSession===session&&auth.connected&&!paused&&dirty())schedule(problem?60000:5000);
 }
 async function prepare(){await run(async()=>{await auth.prepare();ready=true;message('Google 授權服務已就緒。按「連接 Google Drive」開始。');});}
 function open(){ $('cloudDialog').showModal();try{$('cloudLocalSummary').textContent=summarize(local.get());}catch(e){message(e.message);}if(!ready)prepare();else render();}
 $('cloudOpen').onclick=open;$('cloudQuick').onclick=open;
 $('cloudConnect').onclick=()=>{
  if(!ready){prepare();return;}
  const selectAccount=!expired,expectedSession=++session;clearTimeout(timer);synced=null;lastSync=0;paused=false;problem='';
  // Authorization starts directly in this click handler for popup activation.
  run(async()=>{remote=null;reviewed=false;expired=false;await auth.connect({selectAccount});checkSession(expectedSession);expired=false;connectedBefore=true;await read(expectedSession);message('已連接 Google Drive。');}).then(()=>{if(expectedSession===session&&auth.connected&&automatic()&&!paused)sync();});
 };
 $('cloudDisconnect').onclick=()=>{session++;clearTimeout(timer);connectedBefore=false;auth.disconnect();remote=null;reviewed=false;expired=false;synced=null;lastSync=0;problem='';paused=false;message('已中斷連接，本機與雲端進度都保留。');render();};
 $('cloudAuto').onchange=()=>{paused=false;problem='';if(automatic())sync();else{clearTimeout(timer);render();}};
 $('cloudRead').onclick=()=>run(async()=>{await read();paused=false;message('已下載雲端進度供比較。');});
 $('cloudUpload').onclick=()=>{paused=false;problem='';sync();};
 async function restore(mode){
  if(!remote||!reviewed)throw Error('請先下載並比較雲端進度。');
  if(mode==='replace'&&!confirm('將本機進度還原為這份雲端進度？目前進度會先保留本機快照，可復原。'))return;
  const expectedSession=session,latest=await drive.read();checkSession(expectedSession);
  if(!latest||latest.file.id!==remote.file.id||latest.file.version!==remote.file.version)throw Object.assign(Error('雲端進度已變更，請重新下載比較。'),{code:'conflict'});
  local.apply(remote.data,mode);showReview();message(mode==='merge'?'已合併至本機。':'已還原至本機。');schedule();
 }
 $('cloudMerge').onclick=()=>run(()=>restore('merge'));$('cloudReplace').onclick=()=>run(()=>restore('replace'));
 $('cloudExport').onclick=()=>{try{local.export(global.SideProjectProgress.pack(config.projectId,local.get()));message('已匯出本機進度 JSON。');}catch(e){message(e.message);}};
 global.addEventListener('edf-progress-change',()=>{render();if(!syncing)schedule();});
 global.addEventListener('storage',e=>{if(e.key==='edfwb2-progress-v1')schedule();});
 global.addEventListener('online',()=>{render();if(automatic()&&!paused)sync();});global.addEventListener('offline',render);
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&automatic()&&!paused)sync();});
 setInterval(()=>{render();if(automatic()&&auth.connected&&!paused&&!busy&&document.visibilityState==='visible')sync();},60000);
 render();
})(window);
