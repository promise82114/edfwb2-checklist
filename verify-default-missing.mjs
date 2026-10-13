import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/promi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/placeholder.js');
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try {
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4174');await page.locator('#list tr').first().waitFor();
 const assertMissing=async()=>assert.equal(await page.locator('#filter .active').getAttribute('data-filter'),'missing');
 await assertMissing();
 for(const section of ['weapons','characters','accessories']){
  await page.locator(`[data-tab="${section}"]`).click();await assertMissing();
  const before=await page.locator('#list tr').count(),id=await page.locator('.item-check').first().getAttribute('data-id');
  await page.locator('.item-check').first().click();assert.equal(await page.locator('#list tr').count(),before-1);assert.equal(await page.locator(`[data-id="${id}"]`).count(),0);
  await page.locator('[data-filter="owned"]').click();assert.equal(await page.locator(`[data-id="${id}"]`).isChecked(),true);
  await page.locator('[data-filter="all"]').click();assert.equal(await page.locator('#list tr').count(),before);
  await page.locator(`[data-stat="${section}"]`).click();await assertMissing();assert.equal(await page.locator('#list tr').count(),before-1);
  await page.locator('#search').fill('no-such-item');await page.locator('#clearFilters').click();await assertMissing();assert.equal(await page.locator('#list tr').count(),before-1);
  await page.locator('#undo').click();assert.equal(await page.locator('#list tr').count(),before);await page.locator(`[data-id="${id}"]`).click();
 }
 await page.reload();await assertMissing();assert.equal(await page.locator('#list tr').count(),514);
 for(const section of ['characters','accessories']){await page.locator(`[data-tab="${section}"]`).click();await assertMissing();assert.equal(await page.locator('#list tr').count(),section==='characters'?294:206);}
 await page.locator('[data-tab="missions"]').click();assert.equal(await page.locator('#missionList tr').count(),120);await page.locator('[data-tab="weapons"]').click();await assertMissing();
 assert.deepEqual(errors,[]);console.log('PASS: default missing on load, tabs and progress cards; immediate removal, total stats unchanged, manual all/owned, undo, clear filters, persisted progress, missions unchanged');
} finally {await browser.close();}
