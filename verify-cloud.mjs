import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const require=createRequire('C:/Users/promi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/placeholder.js');
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const context=await browser.newContext({viewport:{width:1366,height:900},serviceWorkers:'block'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await context.route('https://accounts.google.com/gsi/client',route=>route.fulfill({contentType:'application/javascript',body:`window.mockGoogle={calls:0,lifetime:3600,error:null};window.google={accounts:{oauth2:{hasGrantedAllScopes:r=>!r.denied,initTokenClient:options=>{window.mockGoogle.options=options;return {requestAccessToken:request=>{window.mockGoogle.calls++;setTimeout(()=>{if(window.mockGoogle.error){options.error_callback({type:window.mockGoogle.error});return;}options.callback({access_token:'mock-token-'+window.mockGoogle.calls,expires_in:window.mockGoogle.lifetime,scope:options.scope,denied:window.mockGoogle.denied});},0);}};}}}};`}));
 let cloud=null,version=1,fail=0,duplicate=false,writes=0;
 const metadata=()=>({id:'file-edf',name:'edfwb2-checklist.json',version:String(version),size:String(JSON.stringify(cloud).length)});
 await context.route('https://www.googleapis.com/**',async route=>{
  const req=route.request(),u=new URL(req.url());assert.match(req.headers().authorization||'',/^Bearer mock-token-/);
  if(fail){const status=fail;fail=0;await route.fulfill({status,json:{error:'mock failure'}});return;}
  if(req.method()==='GET'){
   if(u.searchParams.get('spaces')==='appDataFolder'){
    assert.equal(u.searchParams.get('q'),"name = 'edfwb2-checklist.json' and trashed = false");
    await route.fulfill({json:{files:cloud?(duplicate?[metadata(),{...metadata(),id:'duplicate'}]:[metadata()]):[]}});return;
   }
   if(u.searchParams.get('alt')==='media'){await route.fulfill({json:cloud,headers:{ETag:'"version-'+version+'"','Access-Control-Expose-Headers':'ETag'}});return;}
   await route.fulfill({json:metadata()});return;
  }
  if(req.method()==='POST'){
   assert.equal(cloud,null);const body=req.postData();assert.match(body,/"parents":\["appDataFolder"\]/);assert.match(body,/"name":"edfwb2-checklist.json"/);
   cloud=JSON.parse(body.split('\r\n\r\n')[2].split('\r\n--')[0]);version++;writes++;await route.fulfill({json:metadata()});return;
  }
  if(req.method()==='PATCH'){
   assert.equal(req.headers()['if-match'],'"version-'+version+'"');cloud=JSON.parse(req.postData());version++;writes++;await route.fulfill({json:metadata()});return;
  }
  throw Error('Unexpected request');
 });
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:4174');const base=await page.evaluate(()=>JSON.parse(JSON.stringify(state))),itemId=await page.locator('#list input').first().getAttribute('data-id');
 await page.locator('#list [data-id="'+itemId+'"]').click();const before=await page.evaluate(()=>localStorage.getItem('edfwb2-progress-v1'));
 await page.locator('#backupOpen').click();await page.locator('#cloudOpen').click();
 await page.waitForFunction(()=>document.getElementById('cloudStatus').textContent.includes('已就緒'));
 await page.locator('#cloudConnect').click();await page.waitForFunction(()=>document.getElementById('cloudStatus').textContent.includes('雲端尚無'));
 assert.equal(writes,0);assert.equal(await page.evaluate(()=>localStorage.getItem('edfwb2-progress-v1')),before);
 assert.equal(await page.evaluate(()=>mockGoogle.options.client_id),'260923931716-cevi1vcfrfoibmn3i2fdpsn1epg7hr3g.apps.googleusercontent.com');assert.equal(await page.evaluate(()=>mockGoogle.options.scope),'https://www.googleapis.com/auth/drive.appdata');
 await page.locator('#cloudUpload').click();await page.waitForFunction(()=>document.getElementById('cloudStatus').textContent.includes('已上傳'));
 assert.equal(writes,1);assert.equal(cloud.schemaVersion,1);assert.equal(cloud.projectId,'edfwb2-checklist');assert.equal(cloud.data.entries[itemId].owned,true);assert.ok(Number.isFinite(Date.parse(cloud.updatedAt)));
 const otherId=await page.evaluate(()=>catalog.items.filter(i=>i.kind==='weapons'&&!i.extra)[1].id);
 cloud={schemaVersion:1,projectId:'edfwb2-checklist',updatedAt:'2026-10-13T01:00:00Z',data:{...base,entries:{[otherId]:{owned:true,updatedAt:Date.now()}},content:{riho:{enabled:true,updatedAt:Date.now()}},favorites:{M01:{favorite:true,updatedAt:Date.now()}}}};version++;
 await page.locator('#cloudDisconnect').click();await page.locator('#cloudConnect').click();await page.waitForFunction(()=>!document.getElementById('cloudChoices').hidden);
 assert.equal(writes,1);assert.equal(await page.evaluate(()=>localStorage.getItem('edfwb2-progress-v1')),before);
 await page.locator('#cloudRead').click();await page.waitForFunction(()=>!document.getElementById('cloudRead').disabled);assert.equal(await page.evaluate(()=>localStorage.getItem('edfwb2-progress-v1')),before);
 await page.locator('#cloudMerge').click();await page.waitForFunction(()=>document.getElementById('cloudStatus').textContent.includes('合併至本機'));
 assert.equal(await page.evaluate(id=>state.entries[id].owned,itemId),true);assert.equal(await page.evaluate(id=>state.entries[id].owned,otherId),true);assert.equal(writes,1);
 const merged=await page.evaluate(()=>localStorage.getItem('edfwb2-progress-v1'));version++;
 page.once('dialog',d=>d.accept());await page.locator('#cloudUpload').click();await page.waitForFunction(()=>document.getElementById('cloudStatus').textContent.includes('雲端進度已變更'));
 assert.equal(writes,1);assert.equal(await page.evaluate(()=>localStorage.getItem('edfwb2-progress-v1')),merged);
 await page.locator('#cloudRead').click();await page.waitForFunction(()=>!document.getElementById('cloudChoices').hidden);
 page.once('dialog',d=>d.dismiss());await page.locator('#cloudReplace').click();await page.waitForFunction(()=>!document.getElementById('cloudReplace').disabled);assert.equal(await page.evaluate(()=>localStorage.getItem('edfwb2-progress-v1')),merged);
 page.once('dialog',d=>d.accept());await page.locator('#cloudReplace').click();await page.waitForFunction(()=>document.getElementById('cloudStatus').textContent.includes('還原至本機'));
 assert.equal(await page.evaluate(id=>state.entries[id].owned,itemId),false);assert.ok(await page.evaluate(()=>snapshots().some(s=>s.label==='匯入前')));
 // Explicit upload updates an existing file, not a duplicate.
 page.once('dialog',d=>d.accept());await page.locator('#cloudUpload').click();await page.waitForFunction(()=>document.getElementById('cloudStatus').textContent.includes('已上傳'));assert.equal(writes,2);
 const dl=page.waitForEvent('download');await page.locator('#cloudExport').click();const exported=JSON.parse(await fs.readFile(await (await dl).path(),'utf8'));assert.equal(exported.projectId,'edfwb2-checklist');
 await page.locator('#cloudDialog .close').click();await page.locator('#backupDialog .close').click();await page.locator('#undo').click();assert.equal(await page.evaluate(id=>state.entries[id].owned,itemId),true);
 await page.locator('#backupOpen').click();await page.locator('#importFile').setInputFiles({name:'cloud.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});await page.locator('#importPreview').waitFor({state:'visible'});await page.locator('#cloudOpen').click();
 const safe=await page.evaluate(()=>localStorage.getItem('edfwb2-progress-v1'));
 for(const status of [403,429,500]){fail=status;await page.locator('#cloudRead').click();await page.waitForFunction(()=>!document.getElementById('cloudRead').disabled);assert.equal(await page.evaluate(()=>localStorage.getItem('edfwb2-progress-v1')),safe);assert.equal(await page.locator('#cloudUpload').isEnabled(),false);}
 const validCloud=cloud;
 for(const bad of [{...validCloud,projectId:'other-game'},{...validCloud,schemaVersion:99},{...validCloud,data:{...validCloud.data,entries:[]}}]){cloud=bad;version++;await page.locator('#cloudRead').click();await page.waitForFunction(()=>!document.getElementById('cloudRead').disabled);assert.equal(await page.evaluate(()=>localStorage.getItem('edfwb2-progress-v1')),safe);assert.equal(await page.locator('#cloudUpload').isEnabled(),false);}
 cloud=validCloud;version++;duplicate=true;await page.locator('#cloudRead').click();await page.waitForFunction(()=>document.getElementById('cloudStatus').textContent.includes('多份'));duplicate=false;
 fail=401;await page.locator('#cloudRead').click();await page.waitForFunction(()=>document.getElementById('cloudConnect').textContent.includes('重新授權'));assert.equal(await page.locator('#cloudRead').isEnabled(),false);assert.equal(await page.evaluate(()=>mockGoogle.calls),2);
 await page.locator('#cloudConnect').click();await page.waitForFunction(()=>!document.getElementById('cloudChoices').hidden);assert.equal(await page.evaluate(()=>mockGoogle.calls),3);
 fail=500;page.once('dialog',d=>d.accept());await page.locator('#cloudUpload').click();await page.waitForFunction(()=>!document.getElementById('cloudConnect').disabled);assert.equal(writes,2);assert.equal(await page.evaluate(()=>localStorage.getItem('edfwb2-progress-v1')),safe);
 await page.locator('#cloudDisconnect').click();await page.evaluate(()=>mockGoogle.lifetime=1);await page.locator('#cloudConnect').click();await page.waitForFunction(()=>document.getElementById('cloudConnect').textContent.includes('重新授權'));
 assert.equal(await page.evaluate(()=>Object.values(localStorage).some(v=>v.includes('mock-token-'))),false);
 await page.evaluate(()=>{mockGoogle.lifetime=3600;mockGoogle.error='popup_closed';});await page.locator('#cloudConnect').click();await page.waitForFunction(()=>document.getElementById('cloudStatus').textContent.includes('視窗已關閉'));
 await page.evaluate(()=>{mockGoogle.error=null;mockGoogle.denied=true;});await page.locator('#cloudConnect').click();await page.waitForFunction(()=>document.getElementById('cloudStatus').textContent.includes('未授予'));
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'outputs/cloud-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await page.locator('#cloudDialog').evaluate(e=>e.scrollWidth<=e.clientWidth),true);
 assert.deepEqual(errors,[]);console.log('PASS: GIS scope, memory-only tokens, create/update, explicit conflict choices, version conflicts, merge/replace/cancel/undo, envelope backup, invalid/cross-project data, duplicates, API failures, 401/expiry/reauthorization, popup/scope denial, mobile');
 await context.close();
}finally{await browser.close();}
