import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/promi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/placeholder.js');
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try {
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:4174');await page.locator('#list tr').first().waitFor();
await page.locator('[data-filter="all"]').click();
assert.equal(await page.locator('.level-stat').count(),4);
for(const lv of [1,2,3,4]){const count=await page.evaluate(lv=>window.EDF_CATALOG.items.filter(i=>i.kind==='weapons'&&i.variant==='Lv.'+lv).length,lv);const card=page.locator(`[data-weapon-level="${lv}"]`);assert.match(await card.textContent(),new RegExp('0 / '+count));await card.click();assert.equal(await page.locator('#level').inputValue(),'Lv.'+lv);assert.equal(await page.locator('#list tr').count(),count);}
await page.locator('[data-weapon-level="4"]').click();assert.equal(await page.locator('#level').inputValue(),'');
await page.locator('[data-weapon-level="1"]').click();const firstID=await page.locator('.item-check').first().getAttribute('data-id');await page.locator('.item-check').first().check();assert.match(await page.locator('[data-weapon-level="1"]').textContent(),/1 \/ /);
const stats=await page.locator('#weaponLevelStats').textContent();await page.locator('#search').fill('フューリアス');assert.equal(await page.locator('#weaponLevelStats').textContent(),stats);await page.locator('#scope').selectOption('base');assert.equal(await page.locator('#weaponLevelStats').textContent(),stats);
await page.reload();await page.locator('[data-filter="all"]').click();assert.equal(await page.locator(`[data-id="${firstID}"]`).isChecked(),true);await page.screenshot({path:'outputs/weapon-levels.png'});
await page.locator('[data-tab="accessories"]').click();assert.equal(await page.locator('#weaponLevelStats').isVisible(),false);assert.equal(await page.locator('#accessoryLevelHead').isVisible(),true);assert.equal(await page.locator('#accessoryLevel').isVisible(),true);
assert.equal(await page.locator('#list tr').first().locator('td').count(),6);
for(const [lv,quality]of [[1,'中古の'],[2,'新品の'],[3,'すごい'],[4,'最強の']]){await page.locator('#accessoryLevel').selectOption(String(lv));const expected=await page.evaluate(q=>window.EDF_CATALOG.items.filter(i=>i.kind==='accessories'&&i.variant.startsWith(q+' · ')).length,quality);assert.equal(await page.locator('#list tr').count(),expected);assert.ok(expected>0);assert.deepEqual([...new Set(await page.locator('.accessory-level-cell').allTextContents())],['LV'+lv]);const variants=await page.locator('#list tr td:nth-child(3)').allTextContents();assert.ok(variants.every(v=>v.startsWith(quality)));}
await page.locator('#level').selectOption('最強の · R型');assert.ok(await page.locator('#list tr').count()>0);await page.locator('#accessoryLevel').selectOption('1');assert.equal(await page.locator('#list tr').count(),0);assert.equal(await page.locator('#empty').isVisible(),true);await page.locator('#clearFilters').click();assert.equal(await page.locator('#accessoryLevel').inputValue(),'');assert.equal(await page.locator('#list tr').count(),207);
await page.screenshot({path:'outputs/accessory-levels.png'});
for(const size of [{width:1366,height:768},{width:390,height:844}]){await page.setViewportSize(size);for(const tab of ['weapons','accessories','characters']){await page.locator(`[data-tab="${tab}"]`).click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.equal(await page.locator('#accessoryLevel').isVisible(),tab==='accessories');assert.equal(await page.locator('#weaponLevelStats').isVisible(),tab==='weapons');if(size.width>720){assert.equal(await page.evaluate(()=>document.documentElement.scrollHeight>innerHeight),false);assert.ok(await page.locator('.table-scroll').evaluate(e=>e.clientHeight)>200);}}}
assert.deepEqual(errors,[]);console.log('PASS: weapon level counts, live update and reload, stable denominators, quick filters, all accessory quality/level mappings, combined filters and reset, responsive layout');
} finally {await browser.close();}
