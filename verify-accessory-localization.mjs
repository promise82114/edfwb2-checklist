import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createRequire} from 'node:module';

const require=createRequire('C:/Users/promi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/placeholder.js');
const {chromium}=require('playwright');
const context={window:{}};vm.createContext(context);
for(const file of ['data','translations'])vm.runInContext(await fs.readFile(new URL('./dist/'+file+'.js',import.meta.url),'utf8'),context);
const {EDF_CATALOG:catalog,EDF_TRANSLATIONS:translations}=context.window;
const accessories=Array.from(catalog.items.filter(item=>item.kind==='accessories'));
const doc=await fs.readFile(new URL('./docs/accessory-localization.md',import.meta.url),'utf8');
const fixtures=doc.split('## 全部既有組合')[1].split(/\r?\n/).filter(line=>line.startsWith('| a-')).map(line=>{
 const [,id,name,variant,zh,level,method,source]=line.split('|').map(value=>value.trim());
 return {id,name,variant,zh,level:Number(level),method,source};
});
assert.equal(fixtures.length,207);assert.equal(new Set(fixtures.map(row=>row.id)).size,207);
assert.equal(fixtures.filter(row=>row.method==='直接核對').length,195);
assert.equal(fixtures.filter(row=>row.method==='詞綴組合').length,12);
assert.equal(new Set(fixtures.flatMap(row=>row.source.split('、'))).size,25);
for(const row of fixtures){
 const item=accessories.find(item=>item.id===row.id);assert.ok(item,row.id);
 assert.equal(item.name,row.name);assert.equal(item.variant,row.variant);
 assert.ok(row.zh.includes(translations.names[item.name]));
 assert.doesNotMatch(row.zh,/通常型|二手|高級/);
}
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const browserContext=await browser.newContext({viewport:{width:1440,height:1000}}),page=await browserContext.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(process.env.TEST_URL||new URL('./dist/index.html',import.meta.url).href);
 await page.locator('[data-tab="accessories"]').click();
 assert.equal(await page.locator('#list tr').count(),207);
 const observed=await page.locator('#list tr').evaluateAll(rows=>rows.map(row=>({id:row.querySelector('.item-check').dataset.id,zh:row.querySelector('.item-translation').textContent,level:row.querySelector('.accessory-level-cell').textContent})));
 for(const row of observed){const fixture=fixtures.find(f=>f.id===row.id);assert.equal(row.zh,fixture.zh,row.id+' full name');assert.equal(row.level,'LV'+fixture.level,row.id+' LV');}
 assert.deepEqual(await page.locator('#accessoryCategoryStats strong').allTextContents(),['身體','手部','腳部','裝飾']);
 for(const [name,level]of [['中古犰狳外套R型',1],['全新海龜鐵甲',2],['強悍蛇皮夾克Y型',3],['最強獅子手套',4],['中古隼鷹連指手套R型',2],['最強海豚冠冕R型',4],['最強旗魚腳鍊Y型',4]]){
  await page.locator('#search').fill(name);
  const exact=page.locator('#list tr').filter({has:page.getByText(name,{exact:true})});
  assert.equal(await exact.count(),1,name);assert.equal(await exact.locator('.accessory-level-cell').textContent(),'LV'+level);
 }
 await page.locator('#search').fill('');
 for(const level of [1,2,3,4]){
  await page.locator('#accessoryLevel').selectOption(String(level));
  const ids=await page.locator('#list .item-check').evaluateAll(inputs=>inputs.map(input=>input.dataset.id).sort());
  assert.deepEqual(ids,fixtures.filter(row=>row.level===level).map(row=>row.id).sort(),'LV'+level+' filters actual levels');
 }
 await page.locator('#accessoryLevel').selectOption('2');
 await page.locator('#level').selectOption('中古の · R型');
 assert.equal(await page.locator('#list tr').count(),1);
 assert.equal(await page.locator('#list .item-translation').textContent(),'中古隼鷹連指手套R型');
 const exceptionId=await page.locator('#list .item-check').getAttribute('data-id');
 assert.equal(exceptionId,'a-52a261c3');
 await page.locator('#accessoryLevel').selectOption('1');
 assert.equal(await page.locator('#list .item-check[data-id="'+exceptionId+'"]').count(),0);
 await page.locator('#accessoryLevel').selectOption('');
 await page.locator('#level').selectOption('');
 await page.locator('#search').fill('中古隼鷹連指手套R型');
 await page.locator('#list .item-check').click();assert.equal(await page.locator('#list tr').count(),0);
 await page.locator('#undo').click();assert.equal(await page.locator('#list .item-check').getAttribute('data-id'),exceptionId);
 await page.locator('#list .item-check').click();await page.reload();
 await page.locator('[data-tab="accessories"]').click();await page.locator('[data-filter="owned"]').click();
 assert.equal(await page.locator('#list .item-check').getAttribute('data-id'),exceptionId);
 assert.equal(await page.locator('#list .item-check').isChecked(),true);
 await page.locator('[data-filter="all"]').click();
 for(const category of ['ボディ','ハンド','フット','オーナメント']){
  const card=page.locator('[data-accessory-category="'+category+'"]');
  await card.click();assert.equal(await page.locator('#list tr').count(),accessories.filter(item=>item.category===category).length);
  await card.click();assert.equal(await page.locator('#list tr').count(),207);
 }
 await page.locator('#search').fill('隼鷹連指手套');
 await fs.mkdir('outputs',{recursive:true});
 await page.screenshot({path:'outputs/accessory-localization-desktop.png'});
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:'outputs/accessory-localization-mobile.png'});
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({passed:true,accessories:207,baseNames:24,direct:195,composed:12,screenshots:25,checks:['complete Chinese names','quality and type affixes','LV2 exception','independent LV and quality filters','Chinese search','category cards','original ID and undo','saved collection after reload','mobile overflow','no page errors']},null,2));
}finally{await browser.close();}
