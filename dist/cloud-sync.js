// EDFWB2 UI adapter. Shared modules never access localStorage or Checklist data.
(function(global){
 'use strict';
 const $=id=>document.getElementById(id),config=global.SIDE_PROJECT_CLOUD_CONFIG;
 const local=global.EDF_CHECKLIST_STORAGE;
 let ready=false,busy=false,remote=null,reviewed=false,connectedBefore=false,expired=false;
 const auth=new global.SideProjectAuth.GoogleAuth(config.clientId,()=>{
  if(!auth.connected&&connectedBefore){expired=true;reviewed=false;remote=null;}
  render();
 });
 const drive=new global.SideProjectDrive.DriveAppData(auth,config.fileName);
 function message(text){$('cloudStatus').textContent=text;}
 function render(){
  if(!reviewed)$('cloudRemoteSummary').textContent='尚未讀取';
  $('cloudConnect').disabled=busy;
  $('cloudConnect').textContent=busy?'處理中…':!ready?'載入 Google 授權服務':expired?'重新授權 Google Drive':auth.connected?'切換 Google 帳號':'連接 Google Drive';
  $('cloudDisconnect').hidden=!auth.connected;$('cloudDisconnect').disabled=busy;
  $('cloudUpload').disabled=busy||!auth.connected||!reviewed;
  $('cloudRead').disabled=busy||!auth.connected;
  $('cloudChoices').hidden=!reviewed||!remote||!auth.connected;
  for(const id of ['cloudMerge','cloudReplace'])$(id).disabled=busy;
 }
 function summarize(data){
  const count=(key,field)=>Object.values(data[key]||{}).filter(e=>e[field]).length;
  return `${count('entries','owned')} 項已取得 · ${count('favorites','favorite')} 關收藏 · ${count('content','enabled')} 項額外內容`;
 }
 function showReview(){
  $('cloudLocalSummary').textContent=summarize(local.get());
  $('cloudRemoteSummary').textContent=remote?summarize(remote.data)+' · '+new Date(remote.value.updatedAt).toLocaleString('zh-TW'):'尚無雲端進度';
  $('cloudUpload').textContent=remote?'以本機進度覆蓋雲端':'上傳本機進度';
  message(remote?'已讀取雲端進度，尚未修改任何進度。請選擇上傳本機、合併雲端，或還原雲端。':'已連接，雲端尚無此遊戲進度。可手動上傳本機進度。');
 }
 async function read(){
  reviewed=false;remote=null;render();
  const loaded=await drive.read();
  if(loaded){
   const validated=global.SideProjectProgress.unpack(loaded.value,config.projectId,local.validate);
   if(validated.unknown)throw Error('雲端含目前版本無法辨識的項目，已停止操作，請更新網站後重試。');
   remote={...loaded,data:validated.data};
  }
  reviewed=true;showReview();
 }
 async function run(action){
  if(busy)return;busy=true;render();
  try{await action();}catch(e){
   if(e.code==='expired'){expired=true;reviewed=false;remote=null;}
   if(e.code==='conflict'){reviewed=false;remote=null;}
   message(e.message||'雲端操作失敗，本機進度仍保留。');
  }finally{busy=false;render();}
 }
 async function prepare(){
  await run(async()=>{await auth.prepare();ready=true;message('Google 授權服務已就緒。按「連接 Google Drive」開始。');});
 }
 $('cloudOpen').onclick=()=>{
  $('cloudDialog').showModal();try{$('cloudLocalSummary').textContent=summarize(local.get());}catch(e){message(e.message);}
  if(!ready)prepare();else render();
 };
 $('cloudConnect').onclick=()=>{
  if(!ready){prepare();return;}
  // Starting connect synchronously preserves the popup's user activation.
  run(async()=>{remote=null;reviewed=false;expired=false;await auth.connect();expired=false;connectedBefore=true;await read();});
 };
 $('cloudDisconnect').onclick=()=>{connectedBefore=false;auth.disconnect();remote=null;reviewed=false;expired=false;message('已中斷此頁連接。本機與雲端進度都保留。');render();};
 $('cloudRead').onclick=()=>run(read);
 $('cloudUpload').onclick=()=>run(async()=>{
  if(!reviewed)throw Error('請先下載比較雲端進度。');
  if(remote&&!confirm('以目前本機進度覆蓋雲端？這不會修改本機進度。'))return;
  const value=global.SideProjectProgress.pack(config.projectId,local.get());
  // Invalidate the review after any write attempt, including uncertain network failures.
  const expected=remote;reviewed=false;remote=null;
  await drive.write(value,expected);await read();message('已上傳本機進度至 Google Drive。');
 });
 async function restore(mode){
  if(!remote||!reviewed)throw Error('請先下載並比較雲端進度。');
  if(mode==='replace'&&!confirm('將本機進度還原為這份雲端進度？目前進度會先保留本機快照，可復原。'))return;
  const latest=await drive.read();
  if(!latest||latest.file.id!==remote.file.id||latest.file.version!==remote.file.version){reviewed=false;remote=null;throw Error('雲端進度已變更，請重新下載比較。');}
  local.apply(remote.data,mode);showReview();message(mode==='merge'?'已將雲端進度合併至本機，尚未上傳。':'已將雲端進度還原至本機，尚未上傳。');
 }
 $('cloudMerge').onclick=()=>run(()=>restore('merge'));
 $('cloudReplace').onclick=()=>run(()=>restore('replace'));
 $('cloudExport').onclick=()=>{try{local.export(global.SideProjectProgress.pack(config.projectId,local.get()));message('已匯出本機進度 JSON，可在「備份與還原」匯入。');}catch(e){message(e.message);}};
 render();
})(window);
