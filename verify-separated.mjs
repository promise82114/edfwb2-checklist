import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/promi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/placeholder.js');
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4174');
 const groups=await page.evaluate(()=>Object.fromEntries(['weapons','characters','accessories','dlcWeapons','dlcCharacters'].map(key=>{const kind=key==='dlcWeapons'?'weapons':key==='dlcCharacters'?'characters':key;const extra=key.startsWith('dlc');return [key,window.EDF_CATALOG.items.filter(i=>i.kind===kind&&(kind==='accessories'||!!i.extra===extra)).map(i=>({id:i.id,variant:i.variant}))];})));
 assert.equal(groups.weapons.length+groups.dlcWeapons.length,688);assert.equal(groups.characters.length+groups.dlcCharacters.length,313);
 const cards=await page.locator('#stats .stat').evaluateAll(es=>es.map(e=>({key:e.dataset.stat,top:e.offsetTop})));
 assert.equal(cards.length,5);assert.equal(cards[0].top,cards[2].top);assert.ok(cards[3].top>cards[0].top);assert.equal(cards[3].top,cards[4].top);
 const owned=[];
 for(const key of Object.keys(groups)){
  await page.locator(`[data-stat="${key}"]`).click();assert.equal(await page.locator('#filter .active').getAttribute('data-filter'),'missing');
  assert.equal(await page.locator('#scope').isVisible(),false);
  assert.equal(await page.locator('#list tr').count(),groups[key].length);
  const ids=await page.locator('#list .item-check').evaluateAll(es=>es.map(e=>e.dataset.id));assert.deepEqual(ids,groups[key].map(i=>i.id));
  if(key==='weapons'||key==='dlcWeapons')for(const lv of [1,2,3,4])assert.match(await page.locator(`[data-weapon-level="${lv}"]`).textContent(),new RegExp('0 / '+groups[key].filter(i=>i.variant==='Lv.'+lv).length));
  const id=groups[key][0].id;owned.push(id);await page.locator(`#list [data-id="${id}"]`).click();assert.equal(await page.locator('#list tr').count(),groups[key].length-1);
  assert.match(await page.locator(`[data-stat="${key}"] .stat-number`).textContent(),new RegExp('1/ '+groups[key].length));
  await page.locator('#search').fill('nothingmatches');await page.locator('#clearFilters').click();assert.equal(await page.locator(`[data-stat="${key}"]`).getAttribute('class'),'stat selected');assert.equal(await page.locator('#list tr').count(),groups[key].length-1);
  await page.locator('[data-filter="owned"]').click();assert.equal(await page.locator(`#list [data-id="${id}"]`).isChecked(),true);
 }
 await page.reload();for(const key of Object.keys(groups)){await page.locator(`[data-tab="${key}"]`).click();assert.equal(await page.locator('#list tr').count(),groups[key].length-1);}
 assert.deepEqual(await page.evaluate(()=>Object.entries(JSON.parse(localStorage.getItem('edfwb2-progress-v1')).entries).filter(([id,e])=>e.owned).map(([id])=>id)),owned);
 await page.locator('[data-tab="missions"]').click();assert.equal(await page.locator('#scope').isVisible(),true);assert.equal(await page.locator('#missionList tr').count(),120);await page.locator('#scope').selectOption('extra');assert.equal(await page.locator('#missionList tr').count(),16);
 await page.locator('[data-stat="weapons"]').click();await page.screenshot({path:'outputs/separated-desktop.png'});
 assert.ok(await page.locator('.table-scroll').evaluate(e=>e.clientHeight)>150);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'outputs/separated-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 for(const key of Object.keys(groups)){await page.locator(`[data-stat="${key}"]`).click();assert.equal(await page.locator('#list tr').count(),groups[key].length-1);}
 assert.deepEqual(errors,[]);console.log('PASS: two-row cards, separate base/DLC lists and progress/LV counts, missing defaults, reset stays in tab, preserved IDs/reload, mission scope, mobile and desktop');
}finally{await browser.close();}
