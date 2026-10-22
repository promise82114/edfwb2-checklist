import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {enableAllContent} from './verify-content-support.mjs';

const require=createRequire('C:/Users/promi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/placeholder.js');
const {chromium}=require('playwright');
const context={window:{}};
vm.createContext(context);
for(const file of ['data','translations'])vm.runInContext(await fs.readFile(new URL('./dist/'+file+'.js',import.meta.url),'utf8'),context);
const {EDF_CATALOG:catalog,EDF_TRANSLATIONS:translations}=context.window;
const doc=await fs.readFile(new URL('./docs/localization-review.md',import.meta.url),'utf8');
const fixtures=doc.split(/\r?\n/).filter(line=>line.startsWith('| ')&&!line.startsWith('| 日文')&&!line.startsWith('| ---')).map(line=>{
 const [,name,zh,versions,,source]=line.split('|').map(x=>x.trim());
 return {name,zh,versions,source};
});
assert.equal(new Set(fixtures.map(row=>row.name)).size,fixtures.length,'no duplicated evidence rows');
const characters=catalog.items.filter(i=>i.kind==='characters');
for(const row of fixtures){
 assert.ok(characters.some(i=>i.name===row.name),row.name+' has a catalog entry');
 assert.equal(translations.names[row.name],row.zh,row.name);
}
assert.equal(new Set(fixtures.flatMap(row=>row.source==='PS Remote Play 畫面'?[]:row.source.split('、'))).size,34);
assert.deepEqual(Array.from(translations.versionlessCharacters).sort(),fixtures.filter(row=>row.versions==='無版本符號').map(row=>row.name).sort());
assert.deepEqual([...new Set(characters.map(i=>i.name))].filter(name=>!fixtures.some(row=>row.name===name)),[
 '本田広報官','姫川広報官','エアレイ先輩','双葉理保 14歳 ～夏～','双葉理保 19歳 ～冬～'
]);

const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const browserContext=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await browserContext.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(process.env.TEST_URL||new URL('./dist/index.html',import.meta.url).href);
 await page.locator('#list tr').first().waitFor();
 assert.match(await page.locator('.translation-notice').textContent(),/部分角色／武器名稱已核對遊戲繁中/);
 const rowFor=id=>page.locator('#list tr').filter({has:page.locator('.item-check[data-id="'+id+'"]')});
 await page.locator('[data-tab="characters"]').click();
 assert.equal(await page.locator('#list tr').count(),295);
 await enableAllContent(page);
 let checkedRows=0;
 for(const tab of ['characters','dlcCharacters']){
  await page.locator('[data-tab="'+tab+'"]').click();
  const observed=await page.locator('#list tr').evaluateAll(rows=>rows.map(row=>({id:row.querySelector('.item-check').dataset.id,text:row.querySelector('.item-translation').textContent})));
  for(const row of observed){
   const item=characters.find(i=>i.id===row.id),fixture=fixtures.find(f=>f.name===item.name);
   if(!fixture)continue;
   const suffix=fixture.versions==='無版本符號'||fixture.versions==='β（名稱內含）'?'':' '+item.variant;
   assert.equal(row.text,fixture.zh+suffix,item.id+' '+item.name);
   checkedRows++;
  }
 }
 const checks=[
  ['characters','熊熊弟兄',3],
  ['characters','珍奶姊妹 γ',1],
  ['characters','新進突擊兵(EDF6) β',1],
  ['characters','異星太空人',1],
  ['dlcCharacters','新進飛翼潛行兵(EDF6)',1],
  ['dlcCharacters','異星太空人 β',1],
  ['dlcCharacters','劍兵(EDF5) 老百姓',1]
 ];
 for(const [tab,search,count] of checks){
  await page.locator('[data-tab="'+tab+'"]').click();
  await page.locator('#search').fill(search);
  assert.equal(await page.locator('#list tr').count(),count,search);
 }
 await page.locator('[data-tab="characters"]').click();
 await page.locator('#search').fill('珍奶姊妹 γ');
 const tapioca=characters.find(i=>i.name==='タピオカシスター'&&i.variant==='γ');
 await rowFor(tapioca.id).locator('.item-check').click();
 assert.equal(await page.locator('#list tr').count(),0,'checked item leaves missing filter');
 await page.locator('#undo').click();
 assert.equal(await rowFor(tapioca.id).locator('.item-check').isChecked(),false,'undo preserves the original catalog ID');
 await page.locator('[data-tab="weapons"]').click();
 await page.locator('#search').fill('珍奶姊妹');
 assert.ok(await page.locator('#list tr').count()>0,'weapon owner search uses the corrected name');
 const owner=page.locator('.owner-button[data-owner="タピオカシスター"]').first();
 assert.match(await owner.textContent(),/珍奶姊妹/);
 await owner.hover();
 assert.equal(await page.locator('#appearanceTooltip > strong').textContent(),'珍奶姊妹');
 await page.locator('[data-tab="characters"]').click();
 await page.locator('#search').fill('');
 await fs.mkdir('outputs',{recursive:true});
 await page.screenshot({path:'outputs/localization-desktop.png'});
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'mobile layout has no horizontal overflow');
 await page.screenshot({path:'outputs/localization-mobile.png'});
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({passed:true,verifiedNames:fixtures.length,verifiedRows:checkedRows,screenshots:34,checks:['evidence coverage','exact names and Greek version symbols','single-version names','embedded beta names','Chinese search','DLC names','collection and undo','weapon owner search and tooltip','mobile overflow','no page errors']},null,2));
}finally{await browser.close();}
