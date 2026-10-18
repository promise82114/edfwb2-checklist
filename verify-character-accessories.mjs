import {enableAllContent} from './verify-content-support.mjs';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/promi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/placeholder.js');
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const context=await browser.newContext({viewport:{width:1366,height:900}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:4174');
 await page.locator('[data-tab="characters"]').click();
 const input=key=>page.locator(`[data-character-accessory-filter="${key}"]`);
 const row=(name,variant)=>page.locator('#list tr').filter({has:page.getByRole('checkbox',{name:name+variant+' 已取得',exact:true})});
 const equipment=async(name,variant)=>row(name,variant).locator('[data-character-accessory]').evaluateAll(es=>es.filter(e=>e.dataset.equippable==='true').map(e=>e.dataset.characterAccessory));
 const ids=()=>page.locator('#list .item-check').evaluateAll(es=>es.map(e=>e.dataset.id));
 assert.equal(await page.locator('#list tr').count(),295);
 assert.equal(await page.locator('[data-character-accessory-head]:visible').count(),4);
 const data=await page.evaluate(()=>({characters:window.EDF_CATALOG.items.filter(i=>i.kind==='characters'),slots:window.EDF_CHARACTER_ACCESSORIES.slots}));
 assert.equal(data.characters.length,313);assert.equal(Object.keys(data.slots).length,313);
 for(const i of data.characters){assert.equal(data.slots[i.id].length,2,i.name+' '+i.variant);assert.equal(new Set(data.slots[i.id]).size,2);}
 // Fixtures are checked against the source tables, including version-specific columns.
 assert.deepEqual(await equipment('陸戦兵(EDF1)','α'),['body','hand']);
 assert.deepEqual(await equipment('陸戦兵(EDF1)','β'),['body','ornament']);
 assert.deepEqual(await equipment('陸戦兵(EDF1)','γ'),['body','foot']);
 assert.deepEqual(await equipment('コスモノーツ','無印'),['body','foot']);
 assert.deepEqual(await equipment('プロールライダー(EDF:IR)KR仕様','無印'),['hand','foot']);
 assert.equal(await row('陸戦兵(EDF1)','α').locator('[data-character-accessory="foot"] [role="img"]').getAttribute('aria-label'),'足部（鞋子）：不可裝備');
 assert.equal(await row('陸戦兵(EDF1)','γ').locator('[data-character-accessory="foot"]').textContent(),'■');
 assert.equal(await row('陸戦兵(EDF1)','α').locator('[data-character-accessory="foot"]').textContent(),'□');
 const base=data.characters.filter(i=>!i.extra);
 for(const key of ['body','hand','foot','ornament']){
  await input(key).check();
  assert.deepEqual(await ids(),base.filter(i=>data.slots[i.id].includes(key)).map(i=>i.id));
  await page.locator('#clearCharacterAccessories').click();
 }
 await input('foot').check();await input('body').check();
 assert.deepEqual(await ids(),base.filter(i=>data.slots[i.id].includes('foot')&&data.slots[i.id].includes('body')).map(i=>i.id));
 await input('hand').check();assert.equal(await page.locator('#list tr').count(),0);assert.equal(await page.locator('#empty').isVisible(),true);
 await page.locator('#clearFilters').click();assert.equal(await page.locator('#list tr').count(),295);assert.equal(await page.locator('#characterAccessoryFilters input:checked').count(),0);
 await input('foot').check();await page.locator('#level').selectOption('γ');await page.locator('#search').fill('陸戦兵(EDF1)');
 assert.equal(await page.locator('#list tr').count(),1);
 await page.locator('#list .item-check').click();assert.equal(await page.locator('#list tr').count(),0);
 assert.equal(await input('foot').isChecked(),true);await page.locator('#undo').click();assert.equal(await page.locator('#list tr').count(),1);
 await page.locator('[data-filter="all"]').click();await page.locator('#list .item-check').click();await page.locator('[data-filter="owned"]').click();assert.equal(await page.locator('#list tr').count(),1);
 await page.locator('#clearCharacterAccessories').click();assert.equal(await page.locator('#level').inputValue(),'γ');assert.equal(await page.locator('#search').inputValue(),'陸戦兵(EDF1)');assert.equal(await page.locator('#filter .active').getAttribute('data-filter'),'owned');
 await page.locator('#undo').click();
 await enableAllContent(page);await page.locator('[data-tab="dlcCharacters"]').click();
 assert.equal(await page.locator('#list tr').count(),18);assert.equal(await page.locator('#characterAccessoryFilters').isVisible(),true);
 // DLC β names carry a separate α table; they must not inherit the base character's slots.
 const dlcCosmo=page.locator('#list tr').filter({has:page.getByRole('checkbox',{name:'コスモノーツβ 已取得',exact:true})});
 assert.deepEqual(await dlcCosmo.locator('[data-equippable="true"]').evaluateAll(es=>es.map(e=>e.dataset.characterAccessory)),['body','hand']);
 await input('foot').check();assert.deepEqual(await ids(),data.characters.filter(i=>i.extra&&data.slots[i.id].includes('foot')).map(i=>i.id));
 for(const tab of ['weapons','accessories','missions']){
  await page.locator(`[data-tab="${tab}"]`).click();assert.equal(await page.locator('#characterAccessoryFilters').isVisible(),false);assert.equal(await page.locator('[data-character-accessory-head]:visible').count(),0);
 }
 // A short desktop with both progress-card rows must keep empty-state recovery clickable.
 await page.setViewportSize({width:1366,height:768});await page.locator('[data-tab="characters"]').click();
 await page.locator('#search').fill('nothingmatches');await page.locator('#clearFilters').click();assert.equal(await page.locator('#list tr').count(),295);
 await page.setViewportSize({width:1366,height:900});
 await page.locator('[data-tab="characters"]').click();await input('foot').check();
 await page.screenshot({path:'outputs/character-accessories-desktop.png'});
 assert.ok(await page.locator('.table-scroll').evaluate(e=>e.clientHeight)>150);
 await page.setViewportSize({width:390,height:844});await page.locator('#characterAccessoryFilters').scrollIntoViewIfNeeded();
 await page.screenshot({path:'outputs/character-accessories-mobile.png'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.equal(await page.locator('#characterAccessoryFilters').evaluate(e=>e.scrollWidth<=e.clientWidth),true);
 await input('body').check();assert.equal(await row('陸戦兵(EDF1)','γ').count(),1);assert.equal(await row('陸戦兵(EDF1)','α').count(),0);
 await page.locator('.table-scroll').evaluate(e=>e.scrollLeft=e.scrollWidth);
 assert.equal(await page.locator('#list tr').first().locator('[data-character-accessory]').count(),4);
 await page.locator('.table-scroll').scrollIntoViewIfNeeded();await page.screenshot({path:'outputs/character-accessories-mobile-table.png'});
 // The new data is cached along with the app for offline use.
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
 await page.waitForFunction(async()=>{const cache=await caches.open('edfwb2-field-log-v20');return !!await cache.match('./character-accessories.js');});
 assert.deepEqual(errors,[]);
 console.log('PASS: all 313 character versions, known source fixtures, four eligibility columns, four filters and intersection, search/version/progress/undo, reset, DLC eligibility, tab isolation, desktop/mobile layout and offline asset cache');
}finally{await browser.close();}
