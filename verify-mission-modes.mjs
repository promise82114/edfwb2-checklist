import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/promi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/placeholder.js');
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const context=await browser.newContext({viewport:{width:1366,height:900}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:4174');await page.locator('[data-tab="missions"]').click();
 assert.deepEqual(await page.locator('#weaponLevelStats strong').allTextContents(),['武器LV1','武器LV2','武器LV3','武器LV4','角色']);
 const code=await page.evaluate(()=>missionData().rows.find(m=>m.weaponTargets.some(t=>t.characters.length>1)).code);
 const row=page.locator('[data-mission-row="'+code+'"]');await row.locator('summary').click();await row.locator('.weapon-target').first().waitFor();
 const expected=await page.evaluate(code=>{const m=missionData().rows.find(m=>m.code===code);return {cards:m.weaponTargets.length,group:m.weaponTargets.find(t=>t.characters.length>1)};},code);
 assert.equal(await row.locator('.weapon-target').count(),expected.cards);
 const card=row.locator('[data-weapon-id="'+expected.group.weapon.id+'"]');assert.equal(await card.count(),1);assert.equal(await card.locator('.mission-weapon .item-check').count(),1);assert.ok(await card.locator('.mission-owner-group').count()>0);
 assert.equal(await row.locator('.mission-weapon .item-check').count(),expected.cards); // one input per unique weapon, not per owner
 await page.screenshot({path:'outputs/mission-weapons-compact.png'});
 const id=expected.group.weapon.id;await card.locator('.mission-weapon input').click();assert.equal(await row.locator('[data-weapon-id="'+id+'"]').count(),1);assert.equal(await card.locator('.mission-weapon input').isChecked(),true);await page.locator('#undo').click();assert.equal(await row.locator('[data-weapon-id="'+id+'"]').count(),1);
 // DLC selection changes the full candidate denominator in both modes.
 const m05=page.locator('[data-mission-row="M05"]'),before=await m05.locator('[data-fixed-count]').textContent();assert.match(before,/名角色/);
 await page.locator('#settingsOpen').click();await page.locator('#content-character-6').check();await page.locator('#settingsDialog .close').click();
 assert.equal(parseInt(await m05.locator('[data-fixed-count]').textContent()),parseInt(before)+1);
 await page.locator('[data-mission-mode="characters"]').click();assert.equal(await page.locator('#missionTable [data-mission-target-head]').textContent(),'未取得角色');assert.equal(await page.locator('#missionOther').isVisible(),false);
 assert.equal(parseInt(await m05.locator('[data-fixed-count]').textContent()),parseInt(before)+1);
 await m05.locator('summary').click();const professor=await page.evaluate(()=>catalog.items.find(i=>i.name==='プロフェッサー'&&i.kind==='characters').id);
 await m05.locator('[data-id="'+professor+'"]').waitFor();assert.equal(await m05.locator('[data-id="'+professor+'"]').count(),1);
 await m05.locator('.favorite-star').click();const fav=page.locator('[data-favorite-row="M05"]');await page.locator('[data-mission-tab="favorites"]').click();await fav.locator('summary').click();await fav.locator('[data-id="'+professor+'"]').waitFor();assert.equal(await fav.locator('[data-id="'+professor+'"]').count(),1);
 const fixed=await m05.locator('[data-fixed-count]').textContent();await fav.locator('[data-id="'+professor+'"]').click();assert.equal(await m05.locator('[data-id="'+professor+'"]').count(),0);assert.equal(await fav.locator('[data-id="'+professor+'"]').count(),0);assert.equal(await m05.locator('[data-fixed-count]').textContent(),fixed);
 await page.locator('#undo').click();assert.equal(await m05.locator('[data-id="'+professor+'"]').count(),1);
 await page.screenshot({path:'outputs/mission-characters.png'});
 await page.locator('[data-mission-tab="all"]').click();await page.locator('#search').fill('教授');assert.ok(await page.locator('#missionList tr').count()>0);await page.locator('#search').fill('');
 await page.locator('#settingsOpen').click();await page.locator('#content-character-6').uncheck();await page.locator('#settingsDialog .close').click();assert.equal(await m05.locator('[data-fixed-count]').textContent(),before);assert.equal(await m05.locator('[data-id="'+professor+'"]').count(),0);
 // Character completion and weapon completion are independent.
 await page.evaluate(()=>{for(const c of availableItems().filter(i=>i.kind==='characters'))state.entries[c.id]={owned:true,updatedAt:Date.now()};persist();render();});
 await page.locator('#missionOnlyUseful').check();assert.equal(await page.locator('#missionList tr').count(),0);
 await page.locator('[data-weapon-level="1"]').click();assert.ok(await page.locator('#missionList tr').count()>0);
 await page.locator('#missionOnlyUseful').uncheck();await page.locator('[data-mission-mode="characters"]').click();assert.match(await page.locator('[data-mission-row="M01"]').textContent(),/候選角色皆已取得/);
 for(const code of ['M99','M100','M101','M102','M104']){assert.match(await page.locator('[data-mission-row="'+code+'"]').textContent(),/0 名角色/);assert.equal(await page.locator('[data-mission-row="'+code+'"] details').count(),0);}
 await page.reload();await page.locator('[data-tab="characters"]').click();await page.locator('[data-filter="owned"]').click();assert.equal(await page.locator('#list tr').count(),295);
 await page.locator('[data-tab="missions"]').click();await page.locator('[data-mission-mode="characters"]').click();assert.match(await page.locator('[data-mission-row="M01"]').textContent(),/候選角色皆已取得/);
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await page.locator('#weaponLevelStats button').count(),5);await page.screenshot({path:'outputs/mission-modes-mobile.png'});
 assert.deepEqual(errors,[]);console.log('PASS: five progress modes, unique weapon cards with grouped owners, independent character collection/undo, DLC candidate denominators, favorites, search/useful filters, empty stages, reload and mobile');
}finally{await browser.close();}
