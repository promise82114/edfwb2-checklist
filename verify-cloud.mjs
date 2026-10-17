import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const require=createRequire('C:/Users/promi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/placeholder.js');
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const context=await browser.newContext({viewport:{width:1366,height:900},serviceWorkers:'block'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await context.route('https://accounts.google.com/gsi/client',route=>route.fulfill({contentType:'application/javascript',body:`window.mockGoogle={calls:0,lifetime:3600,error:null};window.google={accounts:{oauth2:{hasGrantedAllScopes:r=>!r.denied,initTokenClient:options=>{window.mockGoogle.options=options;return {requestAccessToken:request=>{window.mockGoogle.calls++;window.mockGoogle.request=request;setTimeout(()=>{if(window.mockGoogle.error){options.error_callback({type:window.mockGoogle.error});return;}options.callback({access_token:'mock-token-'+window.mockGoogle.calls,expires_in:window.mockGoogle.lifetime,scope:options.scope,denied:window.mockGoogle.denied});},0);}};}}}};`}));
 let cloud=null,version=1,fail=0,duplicate=false,writes=0,collisionOnWrite=false,missingEtag=false;
 const metadata=()=>({id:'file-edf',name:'edfwb2-checklist.json',version:String(version),size:String(JSON.stringify(cloud).length)});
 await context.route('https://www.googleapis.com/**',async route=>{
  const req=route.request(),u=new URL(req.url());assert.match(req.headers().authorization||'',/^Bearer mock-token-/);
  if(fail){const status=fail;fail=0;await route.fulfill({status,json:{error:'mock failure'}});return;}
  if(req.method()==='GET'){
   if(u.searchParams.get('spaces')==='appDataFolder'){
    assert.equal(u.searchParams.get('q'),"name = 'edfwb2-checklist.json' and trashed = false");
    await route.fulfill({json:{files:cloud?(duplicate?[metadata(),{...metadata(),id:'duplicate'}]:[metadata()]):[]}});return;
   }
   if(u.searchParams.get('alt')==='media'){await route.fulfill({json:cloud,headers:missingEtag?{}:{ETag:'"version-'+version+'"','Access-Control-Expose-Headers':'ETag'}});return;}
   await route.fulfill({json:metadata()});return;
  }
  if(req.method()==='POST'){
   assert.equal(cloud,null);const body=req.postData();assert.match(body,/"parents":\["appDataFolder"\]/);assert.match(body,/"name":"edfwb2-checklist.json"/);
   cloud=JSON.parse(body.split('\r\n\r\n')[2].split('\r\n--')[0]);version++;writes++;await route.fulfill({json:metadata()});return;
  }
  if(req.method()==='PATCH'){
   if(collisionOnWrite){collisionOnWrite=false;cloud.data.favorites.M01={favorite:true,updatedAt:Date.now()};version++;await route.fulfill({status:412,json:{error:'concurrent update'}});return;}
   assert.equal(req.headers()['if-match'],missingEtag?undefined:'"version-'+version+'"');cloud=JSON.parse(req.postData());version++;writes++;await route.fulfill({json:metadata()});return;
  }
  throw Error('Unexpected request');
 });
 await page.clock.install();
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:4174');
 const ids=await page.evaluate(()=>catalog.items.filter(i=>i.kind==='weapons'&&!i.extra).slice(0,3).map(i=>i.id));
 const edit=async(id,value)=>page.evaluate(({id,value})=>change([catalog.items.find(i=>i.id===id)],value),{id,value});
 const settled=()=>page.waitForFunction(()=>!document.getElementById('cloudConnect').disabled);
 const synced=()=>page.waitForFunction(()=>document.getElementById('cloudQuick').textContent.startsWith('雲端已同步'));
 await edit(ids[0],true);
 await page.locator('#cloudQuick').click();await page.waitForFunction(()=>document.getElementById('cloudStatus').textContent.includes('已就緒'));
 await page.locator('#cloudConnect').click();await synced();
 assert.equal(writes,1);assert.equal(cloud.data.entries[ids[0]].owned,true);assert.match(await page.locator('#cloudAuthStatus').textContent(),/3600 秒/);
 assert.equal(await page.evaluate(()=>mockGoogle.options.scope),'https://www.googleapis.com/auth/drive.appdata');
 // Burst edits debounce; explicit false is uploaded too.
 await edit(ids[1],true);await edit(ids[0],false);
 assert.equal(writes,1);assert.match(await page.locator('#cloudQuick').textContent(),/待同步/);
 await synced();assert.equal(writes,2);assert.equal(cloud.data.entries[ids[0]].owned,false);assert.equal(cloud.data.entries[ids[1]].owned,true);
 await page.locator('#cloudUpload').click();await synced();assert.equal(writes,2,'unchanged content does not upload');
 // Another device's newer cancellation and acquisition are pulled, preserving local edits.
 cloud.data.entries[ids[1]]={owned:false,updatedAt:Date.now()+1000};cloud.data.entries[ids[2]]={owned:true,updatedAt:Date.now()+1000};version++;
 await page.locator('#cloudUpload').click();await synced();
 assert.equal(await page.evaluate(id=>state.entries[id].owned,ids[1]),false);assert.equal(await page.evaluate(id=>state.entries[id].owned,ids[2]),true);assert.equal(writes,2);
 assert.ok(await page.evaluate(()=>snapshots().some(s=>s.label==='雲端同步前')));
 // ETag conflict retries with a fresh download, keeping both devices' changes.
 await edit(ids[0],true);fail=412;await page.locator('#cloudUpload').click();await synced();assert.equal(writes,3);
 // Offline local changes survive and are flushed on reconnection.
 await context.setOffline(true);await edit(ids[0],false);await page.waitForTimeout(5500);assert.equal(writes,3);
 await context.setOffline(false);await synced();assert.equal(writes,4);assert.equal(cloud.data.entries[ids[0]].owned,false);
 // Auto-off cancels the pending debounce; explicit sync still works.
 await page.locator('#cloudAuto').uncheck();await edit(ids[0],true);await page.waitForTimeout(5500);assert.equal(writes,4);
 await page.locator('#cloudUpload').click();await settled();assert.equal(writes,5);
 await page.locator('#cloudAuto').check();await synced();
 // API errors retain dirty state; online retry succeeds without another grant.
 await edit(ids[0],false);fail=500;await page.locator('#cloudUpload').click();await settled();assert.equal(writes,5);assert.match(await page.locator('#cloudQuick').textContent(),/待重試/);
 await page.evaluate(()=>window.dispatchEvent(new Event('online')));await synced();assert.equal(writes,6);
 // Wrong project and duplicates stop automatic writes.
 const valid=structuredClone(cloud);cloud={...cloud,projectId:'other-game'};version++;
 await page.locator('#cloudUpload').click();await settled();assert.match(await page.locator('#cloudQuick').textContent(),/暫停/);assert.equal(writes,6);
 cloud=valid;version++;duplicate=true;await page.locator('#cloudUpload').click();await settled();assert.match(await page.locator('#cloudStatus').textContent(),/多份/);assert.equal(writes,6);
 duplicate=false;await page.locator('#cloudUpload').click();await synced();
 // 401/expiry requires a click, never opens a popup automatically.
 fail=401;await page.locator('#cloudUpload').click();await settled();assert.match(await page.locator('#cloudQuick').textContent(),/重新授權/);assert.equal(await page.evaluate(()=>mockGoogle.calls),1);assert.match(await page.locator('#cloudAuthStatus').textContent(),/401/);
 await page.locator('#cloudConnect').click();await synced();assert.equal(await page.evaluate(()=>mockGoogle.calls),2);assert.equal(await page.evaluate(()=>mockGoogle.request.prompt),'');
 await page.locator('#cloudDisconnect').click();await edit(ids[0],true);await page.waitForTimeout(5500);assert.equal(writes,6);
 await page.evaluate(()=>mockGoogle.lifetime=1);await page.locator('#cloudConnect').click();await page.waitForFunction(()=>document.getElementById('cloudQuick').textContent.includes('重新授權'));
 assert.match(await page.locator('#cloudAuthStatus').textContent(),/本次 1 秒/);assert.equal(await page.evaluate(()=>Object.values(localStorage).some(v=>v.includes('mock-token-'))),false);
 await page.evaluate(()=>{mockGoogle.lifetime=3600;mockGoogle.error='popup_closed';});await page.locator('#cloudConnect').click();await settled();assert.match(await page.locator('#cloudStatus').textContent(),/視窗已關閉/);
 await page.evaluate(()=>{mockGoogle.error=null;mockGoogle.denied=true;});await page.locator('#cloudConnect').click();await settled();assert.match(await page.locator('#cloudStatus').textContent(),/未授予/);
 // Verify the 60-second poll without waiting a real minute.
 await page.evaluate(()=>mockGoogle.denied=false);await page.locator('#cloudConnect').click();await synced();
 cloud.data.entries[ids[0]]={owned:false,updatedAt:Date.now()+10000};version++;
 await page.clock.fastForward(60000);await page.waitForFunction(id=>state.entries[id].owned===false,ids[0]);await synced();
 // A real conditional write conflict preserves the other device's favorite.
 const priorWrites=writes;collisionOnWrite=true;await edit(ids[1],true);await page.locator('#cloudUpload').click();await synced();
 assert.equal(writes,priorWrites+1);assert.equal(cloud.data.favorites.M01.favorite,true);assert.equal(await page.evaluate(()=>state.favorites.M01.favorite),true);
 // Missing browser-visible ETag remains usable; permission denial still stops writes.
 missingEtag=true;await edit(ids[1],false);await page.locator('#cloudUpload').click();await synced();assert.equal(writes,priorWrites+2);assert.equal(cloud.data.entries[ids[1]].owned,false);
 missingEtag=false;fail=403;await page.locator('#cloudUpload').click();await settled();assert.equal(writes,priorWrites+2);assert.match(await page.locator('#cloudQuick').textContent(),/暫停/);
 await page.locator('#cloudUpload').click();await synced();assert.equal(writes,priorWrites+2);assert.equal(cloud.data.entries[ids[1]].owned,false);
 // Manual restore still confirms, snapshots, and supports undo.
 await page.locator('#cloudAuto').uncheck();await edit(ids[0],true);await page.locator('#cloudRead').click();await settled();
 page.once('dialog',d=>d.dismiss());await page.locator('#cloudReplace').click();await settled();assert.equal(await page.evaluate(id=>state.entries[id].owned,ids[0]),true);
 page.once('dialog',d=>d.accept());await page.locator('#cloudReplace').click();await settled();assert.equal(await page.evaluate(id=>state.entries[id].owned,ids[0]),false);
 await page.locator('#cloudDialog .close').click();await page.locator('#undo').click();assert.equal(await page.evaluate(id=>state.entries[id].owned,ids[0]),true);
 await page.locator('#cloudQuick').click();await page.locator('#cloudAuto').check();await synced();
 // A notes-only edit changes the sync fingerprint; clearing on another device also propagates.
 const beforeNotes=writes;
 await page.locator('#cloudDialog .close').click();await page.locator('[data-tab="missions"]').click();await page.locator('[data-mission-tab="favorites"]').click();
 await page.locator('[data-mission-note="M01"]').fill('雲端測試筆記');
 await page.locator('#cloudQuick').click();await page.locator('#cloudUpload').click();await synced();assert.equal(writes,beforeNotes+1);assert.equal(cloud.data.missionNotes.M01.text,'雲端測試筆記');
 cloud.data.missionNotes.M01={text:'',updatedAt:await page.evaluate(()=>Date.now()+10000)};version++;
 await page.locator('#cloudUpload').click();await synced();assert.equal(await page.evaluate(()=>state.missionNotes.M01.text),'');
 const dl=page.waitForEvent('download');await page.locator('#cloudExport').click();const exported=JSON.parse(await fs.readFile(await (await dl).path(),'utf8'));assert.equal(exported.projectId,'edfwb2-checklist');
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'outputs/cloud-mobile.png'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await page.locator('#cloudDialog').evaluate(e=>e.scrollWidth<=e.clientWidth),true);
 await page.locator('#cloudDialog .close').click();assert.equal(await page.locator('#cloudQuick').isVisible(),true);await page.screenshot({path:'outputs/cloud-header-mobile.png'});
 await page.setViewportSize({width:1366,height:900});await page.screenshot({path:'outputs/cloud-header-desktop.png'});
 assert.deepEqual(errors,[]);console.log('PASS: auto-connect sync, 5s debounce, cancellations, newest-item merge, snapshots, ETag retry, offline/online, auto-off/manual sync, unchanged no-upload, failures, invalid data, duplicate files, expiry/reauthorization, token isolation, 60s polling, export, mobile/header');
 await context.close();
}finally{await browser.close();}
