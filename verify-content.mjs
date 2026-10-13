import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const require=createRequire('C:/Users/promi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/placeholder.js');
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const context=await browser.newContext({viewport:{width:1366,height:900}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.TEST_URL||'http://127.0.0.1:4174');
 const open=async()=>page.locator('#settingsOpen').click(),close=async()=>page.locator('#settingsDialog .close').click();
 const counts=async()=>page.evaluate(()=>({characters:sectionItems('dlcCharacters').length,weapons:sectionItems('dlcWeapons').length,missions:missionData().rows.length}));
 assert.deepEqual(await counts(),{characters:0,weapons:0,missions:104});
 for(const key of ['dlcWeapons','dlcCharacters']){
  assert.equal(await page.locator('[data-tab="'+key+'"]').isVisible(),false);
  assert.equal(await page.locator('[data-stat="'+key+'"]').isVisible(),false);
 }
 await open();assert.equal(await page.locator('#seasonChildren input').count(),14);
 const options=await page.evaluate(()=>content.options.map(o=>({id:o.id,characters:o.characters.length})));assert.equal(options.length,18);
 for(const o of options){
  await page.locator('#content-'+o.id).check();const expectedWeapons=o.id==='mission-pack'?130:['character-6','character-7','character-8','honda','himekawa','air-senpai'].includes(o.id)?5:o.id==='riho'?10:0;
  assert.deepEqual(await counts(),{characters:o.characters,weapons:expectedWeapons,missions:o.id==='mission-pack'?120:104},o.id);
  for(const [key,visible] of [['dlcCharacters',o.characters>0],['dlcWeapons',expectedWeapons>0]]){
   assert.equal(await page.locator('[data-tab="'+key+'"]').isVisible(),visible,o.id);
   assert.equal(await page.locator('[data-stat="'+key+'"]').isVisible(),visible,o.id);
  }
  if(o.id==='character-6'){
   const row=await page.evaluate(()=>{const previous=missionLevel;missionLevel=2;const row=missionData().rows.find(m=>m.code==='M05');missionLevel=previous;return row;});assert.ok(row.candidates.some(c=>c.name==='プロフェッサー'));assert.ok(row.targets.some(t=>t.character.name==='プロフェッサー'));
  }
  if(o.id==='mission-pack'){
   assert.ok(await page.evaluate(()=>missionData().rows.some(m=>m.boxes.length)));
   assert.equal(await page.evaluate(()=>availableItems().filter(i=>i.extra&&i.kind==='weapons').some(i=>content.excluded.includes(i.id))),false);
  }
  await page.locator('#content-'+o.id).uncheck();assert.deepEqual(await counts(),{characters:0,weapons:0,missions:104});
 }
 await page.locator('#content-character-6').check();await close();
 await page.locator('[data-tab="dlcWeapons"]').click();await open();await page.locator('#content-character-6').uncheck();await close();
 assert.equal(await page.locator('[data-tab="weapons"]').getAttribute('aria-current'),'page');
 assert.equal(await page.locator('[data-tab="dlcWeapons"]').isVisible(),false);
 await open();await page.locator('#content-character-1').check();await close();
 await page.locator('[data-tab="dlcCharacters"]').click();await open();await page.locator('#content-character-1').uncheck();await close();
 assert.equal(await page.locator('[data-tab="characters"]').getAttribute('aria-current'),'page');
 await open();await page.locator('#seasonPass').check();assert.deepEqual(await counts(),{characters:13,weapons:145,missions:120});
 assert.equal(await page.locator('#seasonChildren input:checked').count(),14);
 await page.locator('#content-character-6').uncheck();assert.equal(await page.locator('#seasonPass').evaluate(e=>e.indeterminate),true);assert.deepEqual(await counts(),{characters:12,weapons:140,missions:120});
 await page.locator('#seasonPass').check();assert.equal(await page.locator('#seasonPass').evaluate(e=>e.indeterminate),false);
 for(const id of ['riho','honda','himekawa','air-senpai'])await page.locator('#content-'+id).check();
 assert.deepEqual(await counts(),{characters:18,weapons:170,missions:120});
 await page.screenshot({path:'outputs/settings-desktop.png'});await close();
 await page.locator('[data-tab="dlcWeapons"]').click();assert.equal(await page.locator('#list tr').count(),170);
 for(const lv of [1,2,3,4])assert.match(await page.locator('[data-weapon-level="'+lv+'"]').textContent(),new RegExp('0 / '+await page.evaluate(l=>sectionItems().filter(i=>i.variant==='Lv.'+l).length,lv)));
 const ownedId=await page.locator('#list .item-check').first().getAttribute('data-id');await page.locator('#list [data-id="'+ownedId+'"]').click();
 await page.locator('[data-tab="missions"]').click();await page.locator('[data-mission-row="EX01"] .favorite-star').click();
 await page.locator('#scope').selectOption('extra');assert.equal(await page.locator('#missionList tr').count(),16);
 await open();await page.locator('#content-mission-pack').uncheck();await close();
 assert.equal(await page.locator('#scope').inputValue(),'all');assert.equal(await page.locator('#missionList tr').count(),104);assert.equal(await page.locator('#favoriteMissionList tr').count(),0);
 assert.equal(await page.evaluate(id=>state.entries[id].owned,ownedId),true);
 await page.locator('#undo').click();assert.equal(await page.locator('#missionList tr').count(),120);assert.equal(await page.locator('#favoriteMissionList tr').count(),1);
 await page.reload();assert.deepEqual(await counts(),{characters:18,weapons:170,missions:120});
 const other=await context.newPage();await other.goto(process.env.TEST_URL||'http://127.0.0.1:4174');await other.locator('[data-tab="dlcWeapons"]').click();
 await open();await page.locator('#content-riho').uncheck();await close();await other.waitForFunction(()=>sectionItems('dlcWeapons').length===160);
 await page.locator('#backupOpen').click();const dl=page.waitForEvent('download');await page.locator('#export').click();const backup=JSON.parse(await readFile(await (await dl).path(),'utf8'));assert.equal(backup.content.riho.enabled,false);assert.equal(backup.content['mission-pack'].enabled,true);
 const importData=async(data,mode)=>{await page.locator('#importFile').setInputFiles({name:'test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});await page.locator('#importPreview').waitFor({state:'visible'});if(mode==='replace')page.once('dialog',d=>d.accept());await page.locator('#'+mode).click();};
 await importData({...backup,content:{}},'replace');assert.deepEqual(await counts(),{characters:0,weapons:0,missions:104});
 const legacy={...backup};delete legacy.content;await importData(legacy,'replace');assert.deepEqual(await counts(),{characters:0,weapons:0,missions:104});
 await importData(backup,'replace');assert.deepEqual(await counts(),{characters:16,weapons:160,missions:120});
 await importData({...backup,content:{riho:{enabled:true,updatedAt:Date.now()}}},'merge');assert.deepEqual(await counts(),{characters:18,weapons:170,missions:120});
 await page.locator('#importFile').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...backup,content:[]}))});await page.waitForFunction(()=>document.getElementById('backupMessage').textContent.includes('損壞'));assert.match(await page.locator('#backupMessage').textContent(),/損壞/);assert.deepEqual(await counts(),{characters:18,weapons:170,missions:120});
 await page.locator('#backupDialog .close').click();await page.locator('#undo').click();assert.deepEqual(await counts(),{characters:16,weapons:160,missions:120});
 await page.setViewportSize({width:390,height:844});await open();await page.screenshot({path:'outputs/settings-mobile.png'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await page.locator('#settingsDialog').evaluate(e=>e.scrollWidth<=e.clientWidth),true);
 await page.locator('#content-air-senpai').uncheck();await page.locator('#settingsDialog .settings-done button').click();
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();assert.deepEqual(await counts(),{characters:15,weapons:155,missions:120});
 assert.deepEqual(errors,[]);console.log('PASS: 18 content options, season tree, all 170 weapons, candidate pools, 104/120 missions, ownership/favorite preservation, undo, reload, cross-tab sync, backups, legacy/invalid imports, mobile and offline');
}finally{await browser.close();}

