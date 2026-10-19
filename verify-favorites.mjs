import {enableAllContent} from './verify-content-support.mjs';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const require=createRequire('C:/Users/promi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/placeholder.js');
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const context=await browser.newContext({viewport:{width:1366,height:768}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.TEST_URL||'http://127.0.0.1:4174');await enableAllContent(page);await page.locator('[data-tab="missions"]').click();
 const main=page.locator('#missionList [data-mission-row="M01"]'),star=main.locator('.favorite-star');
 const fixed=await main.locator('[data-fixed-count]').textContent();
 assert.equal(await star.textContent(),'☆');await star.click();
 const fav=page.locator('#favoriteMissionList [data-favorite-row="M01"]');
 assert.equal(await star.textContent(),'★');assert.equal(await fav.locator('[data-fixed-count]').textContent(),fixed);
 assert.equal(await fav.locator('.mission-details').getAttribute('open'),null);
 assert.equal(await fav.locator('.mission-target').count(),0);
 await page.locator('[data-mission-tab="favorites"]').click();await fav.locator('.mission-details summary').click();
 await fav.locator('.mission-target').first().waitFor();
 assert.ok(await fav.locator('.mission-target').count()>0);
 await page.locator('[data-mission-tab="all"]').click();await page.locator('#search').fill('EX16');assert.equal(await page.locator('#missionList tr').count(),1);assert.equal(await fav.count(),0);await page.locator('[data-mission-tab="favorites"]').click();assert.match(await page.locator('#favoriteEmpty').textContent(),/沒有符合/);await page.locator('#favoriteClearFilters').click();assert.equal(await fav.count(),1);await fav.locator('summary').click();await fav.locator('.mission-target').first().waitFor();
 await page.locator('[data-weapon-level="2"]').click();assert.match(await fav.locator('.mission-summary').textContent(),/LV2/);
 const w=fav.locator('.item-check').first(),id=await w.getAttribute('data-id');await w.click();
 assert.equal(await fav.locator(`[data-id="${id}"]`).isChecked(),true);assert.equal(await fav.locator('[data-fixed-count]').textContent(),fixed);
 await page.locator('#undo').click();assert.ok(await fav.locator(`[data-id="${id}"]`).count()>0);
 assert.equal(await page.locator('#missionFavorites').evaluate(e=>getComputedStyle(e).overflowY),'visible');
 assert.equal(await page.locator('#missionFavorites').evaluate(e=>e.scrollHeight<=e.clientHeight+2),true);

 await page.locator('#favoriteTitle').scrollIntoViewIfNeeded();await page.screenshot({path:'outputs/favorites-desktop.png'});
 await page.reload();await page.locator('[data-tab="missions"]').click();await page.locator('[data-mission-tab="favorites"]').click();assert.equal(await fav.count(),1);
 assert.equal(await fav.locator('.mission-details').getAttribute('open'),null);
 const other=await context.newPage();await other.goto(process.env.TEST_URL||'http://127.0.0.1:4174');await other.locator('[data-tab="missions"]').click();await other.locator('[data-mission-tab="favorites"]').click();
 await fav.locator('.favorite-star').click();await other.locator('#favoriteEmpty').waitFor({state:'visible'});
 await page.locator('#undo').click();await other.locator('[data-favorite-row="M01"]').waitFor();
 await page.locator('#backupOpen').click();const downloaded=page.waitForEvent('download');await page.locator('#export').click();
 const backup=JSON.parse(await readFile(await (await downloaded).path(),'utf8'));assert.equal(backup.favorites.M01.favorite,true);
 const importData=async(data,mode)=>{await page.locator('#importFile').setInputFiles({name:'test.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});await page.locator('#importPreview').waitFor({state:'visible'});if(mode==='replace')page.once('dialog',d=>d.accept());await page.locator('#'+mode).click();};
 await importData({...backup,favorites:{EX16:{favorite:true,updatedAt:Date.now()}}},'merge');
 assert.equal(await page.locator('#favoriteMissionList tr').count(),2);
 const legacy={...backup};delete legacy.favorites;await importData(legacy,'replace');assert.equal(await page.locator('#favoriteMissionList tr').count(),2);
 await importData({...backup,favorites:{}},'replace');assert.equal(await page.locator('#favoriteMissionList tr').count(),0);
 await page.locator('#backupDialog .close').click();await page.locator('#undo').click();assert.equal(await page.locator('#favoriteMissionList tr').count(),2);
 await page.locator('#backupOpen').click();await page.locator('#importFile').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...backup,favorites:[]}))});await page.waitForFunction(()=>document.getElementById('backupMessage').textContent.includes('損壞'));assert.equal(await page.locator('#favoriteMissionList tr').count(),2);await page.locator('#backupDialog .close').click();
 // Favorites use the same toolbar and sorting, without altering saved favorites or notes.
 await page.locator('[data-mission-tab="all"]').click();
 for(const code of ['M74','M99']){await page.locator('#search').fill(code);await page.locator('[data-mission-row="'+code+'"] .favorite-star').click();}
 await page.locator('[data-mission-tab="favorites"]').click();await page.locator('#search').fill('');
 assert.equal(await page.locator('.toolbar').isVisible(),true);assert.equal(await page.locator('#missionControls').isVisible(),true);
 const codes=()=>page.locator('#favoriteMissionList tr').evaluateAll(rows=>rows.map(r=>r.dataset.favoriteRow));
 await page.locator('[data-mission-note="M74"]').fill('先救人再清場');const saved=await page.evaluate(()=>JSON.stringify(state));
 await page.locator('#search').fill('先救人');assert.deepEqual(await codes(),['M74']);
 await page.locator('#search').fill('');await page.locator('#missionSort').selectOption('number');assert.deepEqual(await codes(),['M01','M74','M99','EX16']);
 for(const sort of ['coverage','weapons']){await page.locator('#missionSort').selectOption(sort);assert.equal((await codes()).at(-1),'M99');}
 await page.locator('#scope').selectOption('extra');assert.deepEqual(await codes(),['EX16']);
 await page.locator('#scope').selectOption('base');assert.equal((await codes()).includes('EX16'),false);
 await page.locator('#missionOnlyUseful').check();assert.equal((await codes()).includes('M99'),false);
 await page.locator('#search').fill('M99');assert.deepEqual(await codes(),[]);assert.equal(await page.locator('#favoriteClearFilters').isVisible(),true);
 await page.locator('#favoriteClearFilters').click();assert.equal((await codes()).length,4);assert.equal(await page.evaluate(()=>JSON.stringify(state)),saved);
 assert.equal(await page.locator('[data-mission-note="M74"]').inputValue(),'先救人再清場');
 await page.locator('[data-mission-mode="characters"]').click();await page.locator('#missionSort').selectOption('weapons');assert.equal((await codes()).at(-1),'M99');
 await page.locator('[data-weapon-level="2"]').click();
 await page.setViewportSize({width:390,height:844});await page.locator('#favoriteTitle').scrollIntoViewIfNeeded();await page.screenshot({path:'outputs/favorites-mobile.png'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 assert.equal(await page.locator('#missionFavorites').evaluate(e=>e.scrollHeight<=e.clientHeight+2),true);
 await page.locator('[data-tab="weapons"]').click();assert.equal(await page.locator('#missionFavorites').isVisible(),false);
 assert.deepEqual(errors,[]);console.log('PASS: favorites, shared LV/progress, fixed candidates, shared search/scope/sort/useful filters, no inner scrolling, reload, cross-tab removals, export/merge/replace/legacy/invalid imports, undo and mobile');
}finally{await browser.close();}
