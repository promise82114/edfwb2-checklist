import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {enableAllContent} from './verify-content-support.mjs';

const require=createRequire('C:/Users/promi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/placeholder.js');
const {chromium}=require('playwright');
const context={window:{}};
vm.createContext(context);
for(const file of ['data','translations','content'])vm.runInContext(await fs.readFile(new URL('./dist/'+file+'.js',import.meta.url),'utf8'),context);
const {EDF_CATALOG:catalog,EDF_TRANSLATIONS:translations,EDF_CONTENT:content}=context.window;
const weapons=Array.from(catalog.items.filter(i=>i.kind==='weapons'));
const doc=await fs.readFile(new URL('./docs/weapon-localization.md',import.meta.url),'utf8');
const [reviewedSection,unseenSection]=doc.split('## 已核對武器')[1].split('## 未見型號');
const parse=section=>section.split(/\r?\n/).filter(line=>line.startsWith('| w-')).map(line=>{
 const [,id,name,category,level,zh,source]=line.split('|').map(value=>value.trim());
 return {id,name,category,level,zh,source};
});
const reviewed=parse(reviewedSection),unseen=parse(unseenSection),all=[...reviewed,...unseen];
const categoryLabels={'連射':'連射','拡散':'擴散','長射程':'長射程','爆発':'爆炸','剛撃':'強擊','誘導':'追蹤','近接格闘':'近戰','特殊':'特殊'};
assert.equal(new Set(all.map(row=>row.id)).size,weapons.length,'every ID appears exactly once');
assert.equal(new Set(all.map(row=>row.name)).size,weapons.length,'every name appears exactly once');
assert.equal(all.length,688);
for(const row of all){
 const item=weapons.find(i=>i.id===row.id);assert.ok(item,row.id);
 assert.equal(row.name,item.name,row.id+' name');
 assert.equal(row.category,categoryLabels[item.category],row.id+' category');
 assert.equal(row.level,item.variant,row.id+' LV');
 assert.equal(translations.names[item.name],row.zh,row.id+' Chinese name');
}
assert.equal(reviewed.length,596);
assert.equal(reviewed.filter(row=>!weapons.find(i=>i.id===row.id).extra).length,515);
assert.equal(unseen.filter(row=>!weapons.find(i=>i.id===row.id).extra).length,0,'all unreviewed models are DLC/bonus');
assert.equal(new Set(reviewed.flatMap(row=>row.source.split('、'))).size,77);
// Same-level DLC variants must remain attached to their full Japanese model, including unseen gaps.
for(const name of ['デクスター自動小銃D2','AF-15V & ガバナー','プラズマヘビーキャノン改','イグアス・シンギュラリティ'])assert.ok(unseen.some(row=>row.name===name),name+' remains a reference translation');
const fixture=name=>reviewed.find(row=>row.name===name);
assert.equal(fixture('デクスター自動小銃G').zh,'德斯塔自動步槍G');
assert.equal(fixture('プラズマヘビーキャノンR2').zh,'電漿重型加農砲R2');
assert.equal(fixture('ジャギリシステムVI').zh,'珈吉利系統IV');
assert.equal(fixture('ジャギリシステムVI').level,'Lv.4');
assert.equal(fixture('アーケルスなりきりセットDX').zh,'亞凱魯斯變裝套組DX');
for(const row of reviewed)if(Object.hasOwn(translations.families,row.name))assert.equal(translations.families[row.name],row.zh,'exact family name '+row.name);

const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const browserContext=await browser.newContext({viewport:{width:1440,height:1000}}),page=await browserContext.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(process.env.TEST_URL||new URL('./dist/index.html',import.meta.url).href);
 await page.locator('#list tr').first().waitFor();
 assert.equal(await page.locator('#list tr').count(),515);
 await enableAllContent(page);
 let renderedRows=0;
 for(const tab of ['weapons','dlcWeapons']){
  await page.locator('[data-tab="'+tab+'"]').click();
  const rows=await page.locator('#list tr').evaluateAll(rows=>rows.map(row=>({id:row.querySelector('.item-check').dataset.id,zh:row.querySelector('.item-translation').textContent})));
  for(const row of rows){assert.equal(row.zh,all.find(f=>f.id===row.id)?.zh,row.id+' rendered name');renderedRows++;}
 }
 assert.equal(renderedRows,685,'hidden promotional weapons remain excluded');
 for(const id of content.excluded)assert.ok(!await page.locator('#list .item-check[data-id="'+id+'"]').count());
 await page.locator('[data-tab="weapons"]').click();
 assert.equal(await page.locator('#category option[value="誘導"]').textContent(),'追蹤');
 assert.equal(await page.locator('#category option[value="近接格闘"]').textContent(),'近戰');
 for(const [search,count] of [['金札貝克',5],['雙門冰雹刺針II',1],['珈吉利系統IV',1],['空手：青龍級',1]]){
  await page.locator('#search').fill(search);assert.equal(await page.locator('#list tr').count(),count,search);
 }
 await page.locator('#search').fill('珈吉利系統IV');
 await page.locator('#category').selectOption('誘導');
 await page.locator('#level').selectOption('Lv.4');
 assert.equal(await page.locator('#list .item-check').getAttribute('data-id'),fixture('ジャギリシステムVI').id);
 await page.locator('#list .item-check').click();assert.equal(await page.locator('#list tr').count(),0);
 await page.locator('#undo').click();assert.equal(await page.locator('#list .item-check').getAttribute('data-id'),fixture('ジャギリシステムVI').id);
 await page.locator('[data-tab="dlcWeapons"]').click();
 await page.locator('#search').fill('デクスター自動小銃');
 assert.equal(await page.locator('#list tr').count(),5);
 assert.match(await page.locator('#list').textContent(),/德斯塔自動步槍G/);
 assert.match(await page.locator('#list').textContent(),/德克斯特自動步槍D2/);
 await page.locator('[data-tab="missions"]').click();
 await page.locator('#search').fill('金札貝克');
 const mission=page.locator('[data-mission-row]').filter({has:page.locator('details')}).first();
 await mission.locator('summary').first().click();
 const missionWeapon=mission.locator('.mission-weapon').filter({has:page.locator('input[data-id="'+fixture('ジンザベック').id+'"]')});
 assert.match(await missionWeapon.textContent(),/金札貝克/);
 await page.locator('[data-tab="weapons"]').click();
 await page.locator('#search').fill('金札貝克');
 await fs.mkdir('outputs',{recursive:true});
 await page.screenshot({path:'outputs/weapons-localization-desktop.png'});
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.screenshot({path:'outputs/weapons-localization-mobile.png'});
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({passed:true,screenshots:77,reviewedWeapons:reviewed.length,baseWeapons:515,extraWeapons:81,referenceWeapons:unseen.length,renderedRows,checks:['all categories and LVs','complete base coverage','unseen DLC preserved','same-level DLC gaps','family names','Chinese search','category and LV filters','original IDs and undo','mission cards','mobile overflow','no page errors']},null,2));
}finally{await browser.close();}
