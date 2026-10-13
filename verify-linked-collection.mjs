import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/promi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/placeholder.js');
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const context=await browser.newContext({viewport:{width:1366,height:900}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:4174');
 const fixture=await page.evaluate(()=>{const all=availableItems();const m=missionData().rows.find(m=>m.weaponTargets.some(t=>t.characters.length>1));const target=m.weaponTargets.find(t=>t.characters.length>1);for(const w of all.filter(i=>i.kind==='weapons'))state.entries[w.id]={owned:w.id!==target.weapon.id,updatedAt:Date.now()};persist();return {code:m.code,weapon:target.weapon.id,characters:target.characters.map(c=>c.id)};});
 await page.locator('[data-tab="missions"]').click();await page.locator('#search').fill(fixture.code);await page.locator('#missionOnlyUseful').check();
 const row=page.locator('[data-mission-row="'+fixture.code+'"]');await row.locator('.favorite-star').click();await row.locator('summary').click();
 const fav=page.locator('[data-favorite-row="'+fixture.code+'"]');await fav.locator('summary').click();
 const card=row.locator('[data-weapon-id="'+fixture.weapon+'"]');assert.equal(await card.locator('.mission-owner-version input').count(),fixture.characters.length);
 const beforeFixed=await row.locator('[data-fixed-count]').textContent();await card.locator('.mission-weapon input').click();
 assert.equal(await card.count(),1);assert.equal(await card.locator('.mission-weapon input').isChecked(),true);assert.match(await card.textContent(),/武器已取得/);
 assert.match(await row.locator('.mission-summary').textContent(),/武器LV1：0 把/);assert.equal(await fav.locator('[data-weapon-id="'+fixture.weapon+'"] .mission-weapon input').isChecked(),true);
 assert.equal(await page.evaluate(ids=>ids.filter(id=>state.entries[id]?.owned).length,fixture.characters),0);
 const character=fixture.characters[0];await card.locator('[data-id="'+character+'"]').click();
 assert.equal(await card.locator('[data-id="'+character+'"]').isChecked(),true);assert.equal(await fav.locator('[data-id="'+character+'"]').isChecked(),true);
 assert.equal(await page.evaluate(ids=>ids.filter(id=>state.entries[id]?.owned).length,fixture.characters),1);assert.equal(await row.locator('[data-fixed-count]').textContent(),beforeFixed);
 await page.locator('#undo').click();assert.equal(await card.locator('[data-id="'+character+'"]').isChecked(),false);assert.equal(await card.locator('.mission-weapon input').isChecked(),true);
 await card.locator('[data-id="'+character+'"]').click();await page.screenshot({path:'outputs/weapon-character-linked.png'});
 // Collapsing one copy removes only its temporary card; the other stays editable.
 await row.locator('summary').click();await page.waitForFunction(code=>!document.querySelector('[data-mission-row="'+code+'"]'),fixture.code);
 assert.equal(await fav.locator('[data-weapon-id="'+fixture.weapon+'"]').count(),1);
 await fav.locator('summary').click();await page.waitForFunction(()=>!document.querySelector('#favoriteMissionList .mission-details'));
 // Switching modes releases retained cards, but both independent progress records persist.
 await page.locator('#missionOnlyUseful').uncheck();await page.locator('[data-mission-mode="characters"]').click();const charRow=page.locator('[data-mission-row="'+fixture.code+'"]');await charRow.locator('summary').click();assert.equal(await charRow.locator('[data-id="'+character+'"]').count(),0);
 await page.locator('[data-weapon-level="1"]').click();assert.equal(await page.locator('#missionList .weapon-target').count(),0);
 await page.reload();assert.equal(await page.evaluate(id=>state.entries[id].owned,fixture.weapon),true);assert.equal(await page.evaluate(id=>state.entries[id].owned,character),true);
 await page.locator('[data-tab="missions"]').click();await page.locator('[data-mission-mode="characters"]').click();await page.locator('#search').fill(fixture.code);await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.deepEqual(errors,[]);console.log('PASS: independent weapon/character checks, individual variants, retained last weapon under search/useful filters, shared favorites, undo, view-scoped collapse, mode cleanup, counts and reload');
}finally{await browser.close();}
