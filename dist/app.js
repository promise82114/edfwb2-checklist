'use strict';
const KEY='edfwb2-progress-v1', SNAP='edfwb2-snapshots-v1', META='edfwb2-backup-time';
const $=id=>document.getElementById(id);
const catalog=window.EDF_CATALOG;
const details=window.EDF_DETAILS;
const translations=window.EDF_TRANSLATIONS;
const acquisition=window.EDF_ACQUISITION;
const missionCatalog=window.EDF_MISSIONS;
const recommendations=window.EDF_RECOMMENDATIONS;
const recommendationByCode=new Map(recommendations.rows.map(m=>[m.code,m]));
const content=window.EDF_CONTENT;
const characterAccessories=window.EDF_CHARACTER_ACCESSORIES;
const characterAccessoryFilters=new Set();
function characterAccessoryCells(i){
 const slots=characterAccessories.slots[i.id];
 return characterAccessories.categories.map(({key,label})=>{
  const supported=slots?slots.includes(key):null,status=supported===null?'尚未記載':supported?'可裝備':'不可裝備';
  return `<td class="character-accessory-cell" data-character-accessory="${key}" data-equippable="${supported===null?'unknown':supported}" title="${escape(label+'：'+status)}"><span class="equipment-mark${supported===true?' supported':''}" role="img" aria-label="${escape(label+'：'+status)}">${supported===null?'？':supported?'■':'□'}</span></td>`;
 }).join('');
}
function resetCharacterAccessoryFilters(){
 characterAccessoryFilters.clear();
 $('characterAccessoryFilters').querySelectorAll('input').forEach(input=>input.checked=false);
 $('clearCharacterAccessories').disabled=true;
}
const contentIds=new Set(content.options.map(o=>o.id));
function contentEnabled(id){return state.content?.[id]?.enabled===true;}
function available(i){if(content.excluded.includes(i.id))return false;const required=content.requirements[i.id];return required?contentEnabled(required):!i.extra;}
function availableItems(){return catalog.items.filter(available);}
const categoriesZh={'連射':'連射','拡散':'擴散','長射程':'長射程','爆発':'爆炸','剛撃':'強擊','誘導':'追蹤','近接格闘':'近戰','特殊':'特殊','ボディ':'身體','ハンド':'手部','フット':'足部','オーナメント':'飾品','アジア':'亞洲','アフリカ':'非洲','南北アメリカ':'南北美洲','アメリカ':'美洲','ヨーロッパ':'歐洲','中東':'中東','オセアニア':'大洋洲','デジボク':'方塊地球防衛軍','EDF1&2':'EDF 1／2','EDF3&4':'EDF 3／4','EDF5&6':'EDF 5／6','EDF:IA&IR':'EDF IA／IR'};
const variantsZh={'α':'阿法','β':'貝塔','γ':'嘎瑪','無印':'無印'};
const nameZh=n=>translations.names[n]||n;
const familyZh=n=>translations.families[n]||translations.names[n]||n;
const characterMeta=n=>details.characters[n];
function categoryOf(i){return i.kind==='characters'?(characterMeta(i.name)?.pool||i.category):i.category;}
function characterSuffix(i){return /[αβγ]$/.test(i.name)?'':i.variant;}
function displayName(i){return i.name+(i.kind==='characters'?characterSuffix(i):'');}
function translatedName(i){const suffix=i.kind==='characters'&&!translations.versionlessCharacters?.includes(i.name)?characterSuffix(i):'';return nameZh(i.name)+(suffix&&suffix!=='無印'?' '+suffix:'');}
function rescueSlot(name,variant){if(name==='コロニスト')return 'β';if(name==='コスモノーツ')return 'γ';const c=characterMeta(name);return c?.variants.length===1?'α':variant;}
function candidateGroups(name,variant){const c=characterMeta(name);if(!c)return [];const option=content.options.find(o=>o.characters.includes(name));if(option&&!contentEnabled(option.id))return [];const slot=rescueSlot(name,variant);return details.groups.filter(g=>(!g.extra||contentEnabled('mission-pack'))&&g.pools[c.pool]?.includes(slot));}
function rangeLabel(g){return (g.extra?'EX':'M')+String(g.start).padStart(2,'0')+(g.start===g.end?'':'–'+String(g.end).padStart(2,'0'));}
function rangeText(name,variant){const c=characterMeta(name);return candidateGroups(name,variant).map(g=>rangeLabel(g)+(g.uncertain.includes(c.pool)?'？':'')).join('、');}
function appearanceHtml(i){const c=characterMeta(i.name);if(!c)return '<span class="appearance-note">攻略尚未記載</span>';const groups=candidateGroups(i.name,i.variant),base=groups.filter(g=>!g.extra),extra=groups.filter(g=>g.extra);return `<div class="mission-ranges">${base.map(g=>escape(rangeLabel(g)+(g.uncertain.includes(c.pool)?'？':''))).join('、')||(/特典/.test(c.note)?'購買特典':'未記載本篇救出關卡')}</div>${extra.length?'<div class="mission-extra">DLC：'+extra.map(g=>escape(rangeLabel(g))).join('、')+'</div>':''}${c.note?'<div class="appearance-note">'+escape(c.note)+'</div>':''}`;}
function acquisitionOf(i){return acquisition?.weapons[i.id]||{method:i.extra?'unknown':'rescue',note:i.extra?'取得條件待核對':''};}
function ownerHtml(i){const f=details.weaponFamilies[i.family],a=acquisitionOf(i);const labels={box:'DLC 武器箱',bonus:'購買／特典取得',clear:'通關數獎勵',unknown:'取得條件待核對'};const owner=f?.owners.map(n=>`<button class="owner-button" data-owner="${escape(n)}" aria-describedby="appearanceTooltip"><span>${escape(n)}</span><small>${escape(nameZh(n))} ⓘ</small></button>`).join('')||'<span class="appearance-note">無指定角色</span>';return a.method==='rescue'?owner:`<div class="acquisition-badge">${escape(labels[a.method]||a.method)}</div><div class="appearance-note">${escape(a.note||'詳見 Wiki')}</div><details class="owner-reference"><summary>裝備加成角色（非取得來源）</summary>${owner}</details>`;}
function variantText(i){if(i.kind!=='accessories')return i.variant;return i.variant.replace('中古の','二手').replace('新品の','全新').replace('すごい','高級').replace('最強の','最強');}
function accessoryLevel(i){return {'中古の':1,'新品の':2,'すごい':3,'最強の':4}[i.variant.split(' · ')[0]]||null;}
function weaponLevelStats(){
 const box=$('weaponLevelStats');box.hidden=!['weapons','missions'].includes(section);if(box.hidden)return;
 const missions=section==='missions',pool=missions?availableItems().filter(i=>i.kind==='weapons'):sectionItems();
 box.setAttribute('aria-label',missions?'關卡補收模式與收集進度':'武器各等級收集進度');
 box.innerHTML=[1,2,3,4].map(lv=>{const items=pool.filter(i=>i.variant==='Lv.'+lv),n=items.filter(owned).length,pct=items.length?Math.round(n/items.length*100):0,selected=missions?missionMode==='weapons'&&missionLevel===lv:$('level').value==='Lv.'+lv;return `<button class="level-stat${selected?' selected':''}" data-weapon-level="${lv}" aria-pressed="${selected}" aria-label="武器LV${lv} 已取得 ${n} / ${items.length}，${pct}%；點擊篩選"><div class="level-stat-top"><strong>武器LV${lv}</strong><span>${n} / ${items.length}<b>${pct}%</b></span></div><div class="progress"><i style="width:${pct}%"></i></div></button>`;}).join('');
 if(missions){const items=availableItems().filter(i=>i.kind==='characters'),n=items.filter(owned).length,pct=items.length?Math.round(n/items.length*100):0;box.insertAdjacentHTML('beforeend',`<button class="level-stat${missionMode==='characters'?' selected':''}" data-mission-mode="characters" aria-pressed="${missionMode==='characters'}"><div class="level-stat-top"><strong>角色</strong><span>${n} / ${items.length}<b>${pct}%</b></span></div><div class="progress"><i style="width:${pct}%"></i></div></button>`);}
}

function accessoryCategoryStats(){const box=$('accessoryCategoryStats');box.hidden=section!=='accessories';if(box.hidden)return;box.innerHTML=['ボディ','ハンド','フット','オーナメント'].map(key=>{const items=catalog.items.filter(i=>i.kind==='accessories'&&i.category===key),n=items.filter(owned).length,pct=items.length?Math.round(n/items.length*100):0,selected=$('category').value===key;return `<button class="level-stat${selected?' selected':''}" data-accessory-category="${escape(key)}" aria-pressed="${selected}" title="再點一次取消分類篩選"><div class="level-stat-top"><strong>${escape(categoriesZh[key])}</strong><span>${n} / ${items.length}<b>${pct}%</b></span></div><div class="progress"><i style="width:${pct}%"></i></div></button>`;}).join('');}
const ids=new Set(catalog.items.map(i=>i.id));
const missionIds=new Set(missionCatalog.rows.map(m=>m.code));
const sections={weapons:{title:'武器清單',short:'武器',icon:'⌁',kicker:'ARMORY',note:'每個武器名稱與等級分開記錄。用分類和等級篩選，快速對照遊戲裝備欄。'},characters:{title:'角色清單',short:'角色',icon:'♧',kicker:'BROTHERS & SISTERS',note:'α／β／γ 分別記錄；特殊與 DLC 角色依攻略頁的實際版本列出。'},accessories:{title:'配件清單',short:'配件',icon:'◇',kicker:'ACCESSORIES',note:'品質與衍生型分開記錄。配件為額外收集清單，不代表獎盃要求。'}};
for(const [kind,s] of Object.entries(sections))Object.assign(s,{kind,extra:false});
sections.dlcWeapons={...sections.weapons,title:'DLC 武器清單',short:'DLC武器',extra:true};
sections.dlcCharacters={...sections.characters,title:'DLC 角色清單',short:'DLC角色',extra:true};
let activeView='weapons';
function sectionItems(key=activeView){const s=sections[key];return availableItems().filter(i=>i.kind===s.kind&&(s.kind==='accessories'||!!i.extra===s.extra));}
let section='weapons', filter='missing', current=[], undoStack=[], pendingImport=null, storageError='', recovered=false,missionLevel=1,missionMode='weapons',missionRows=[],missionOtherExpanded=false,missionTab='all';
const fresh=()=>({app:'edfwb2-collection',schema:1,catalogVersion:catalog.version,updatedAt:Date.now(),entries:{},favorites:{},content:{},missionNotes:{}});
function validate(raw){
  if(raw?.schemaVersion!==undefined)return window.SideProjectProgress.unpack(raw,window.SIDE_PROJECT_CLOUD_CONFIG.projectId,validate);
  if(!raw||raw.app!=='edfwb2-collection'||raw.schema!==1||!raw.entries||typeof raw.entries!=='object'||Array.isArray(raw.entries))throw Error('這不是支援的 EDF WB2 備份檔。');
  const out=fresh();let unknown=0;
  for(const [id,e] of Object.entries(raw.entries)){
    if(!e||typeof e.owned!=='boolean'||!Number.isFinite(e.updatedAt)||e.updatedAt<0)throw Error('備份中有損壞的項目，未匯入任何資料。');
    if(ids.has(id))out.entries[id]={owned:e.owned,updatedAt:e.updatedAt};else unknown++;
  }
  if(raw.favorites!==undefined){
    if(!raw.favorites||typeof raw.favorites!=='object'||Array.isArray(raw.favorites))throw Error('備份的收藏資料損壞，未匯入任何資料。');
    for(const [code,e] of Object.entries(raw.favorites)){
      if(!e||typeof e.favorite!=='boolean'||!Number.isFinite(e.updatedAt)||e.updatedAt<0)throw Error('備份的收藏資料損壞，未匯入任何資料。');
      if(missionIds.has(code))out.favorites[code]={favorite:e.favorite,updatedAt:e.updatedAt};else unknown++;
    }
  }else delete out.favorites; // Legacy backups do not replace the user's current favorites.
  if(raw.missionNotes!==undefined){
    if(!raw.missionNotes||typeof raw.missionNotes!=='object'||Array.isArray(raw.missionNotes))throw Error('備份的關卡筆記損壞，未匯入任何資料。');
    for(const [code,e] of Object.entries(raw.missionNotes)){
      if(!e||typeof e.text!=='string'||e.text.length>5000||!Number.isFinite(e.updatedAt)||e.updatedAt<0)throw Error('備份的關卡筆記損壞，未匯入任何資料。');
      if(missionIds.has(code))out.missionNotes[code]={text:e.text,updatedAt:e.updatedAt};else unknown++;
    }
  }else delete out.missionNotes;
  if(raw.content!==undefined){
    if(!raw.content||typeof raw.content!=='object'||Array.isArray(raw.content))throw Error('備份的使用者設定損壞，未匯入任何資料。');
    for(const [id,e] of Object.entries(raw.content)){
      if(!e||typeof e.enabled!=='boolean'||!Number.isFinite(e.updatedAt)||e.updatedAt<0)throw Error('備份的使用者設定損壞，未匯入任何資料。');
      if(contentIds.has(id))out.content[id]={enabled:e.enabled,updatedAt:e.updatedAt};else unknown++;
    }
  }else delete out.content; // Legacy backups preserve current content selections on import.
  out.updatedAt=Number.isFinite(raw.updatedAt)?raw.updatedAt:Date.now();return {data:out,unknown};
}
function snapshots(){try{const a=JSON.parse(localStorage.getItem(SNAP)||'[]');return Array.isArray(a)?a.filter(x=>{try{validate(x.data);return true;}catch{return false;}}):[];}catch{return [];}}
function load(){try{const raw=localStorage.getItem(KEY);if(!raw)return fresh();return validate(JSON.parse(raw)).data;}catch(e){storageError='存檔讀取異常，請立即備份';const last=snapshots()[0];if(last){recovered=true;return validate(last.data).data;}return fresh();}}
let state=load();
function owned(i){return state.entries[i.id]?.owned===true;}
function favorite(code){return state.favorites?.[code]?.favorite===true;}
function missionNote(code){return state.missionNotes?.[code]?.text||'';}
function saveMissionNote(input){
 const code=input.dataset.missionNote;if(!missionIds.has(code))return;
 mergeLatest();if(missionNote(code)===input.value)return;
 if(!input.noteUndo){undoStack.push([{id:code,before:missionNote(code),type:'note'}]);undoStack=undoStack.slice(-30);input.noteUndo=true;}
 state.missionNotes??={};state.missionNotes[code]={text:input.value,updatedAt:Date.now()};persist();$('undo').disabled=false;
}
function resizeNote(input){input.style.height='auto';input.style.height=input.scrollHeight+'px';}
window.addEventListener('resize',()=>{if(section==='missions'&&missionTab==='favorites')$('favoriteMissionList').querySelectorAll('textarea').forEach(resizeNote);});
function toggleFavorite(code){if(!missionIds.has(code))return;mergeLatest();const before=favorite(code);undoStack.push([{id:code,before,type:'favorite'}]);undoStack=undoStack.slice(-30);state.favorites??={};state.favorites[code]={favorite:!before,updatedAt:Date.now()};persist();render();toast(before?'已從我的最愛移除 '+code:'已加入我的最愛 '+code);}
function escape(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function toast(s){$('toast').textContent=s;$('toast').hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').hidden=true,4000);}
function status(){const el=$('saveStatus');el.classList.toggle('error',!!storageError);el.textContent=storageError||(state.updatedAt?'● 已自動儲存 '+new Date(state.updatedAt).toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'}):'● 自動儲存就緒');}
function mergeLatest(){try{const raw=localStorage.getItem(KEY);if(!raw)return;const latest=validate(JSON.parse(raw)).data;for(const key of ['entries','favorites','content','missionNotes']){state[key]??={};for(const [id,e]of Object.entries(latest[key]||{}))if(!state[key][id]||e.updatedAt>state[key][id].updatedAt)state[key][id]=e;}}catch{}}
function saveSnapshot(label){try{const list=snapshots();list.unshift({at:Date.now(),label,data:JSON.parse(JSON.stringify(state))});localStorage.setItem(SNAP,JSON.stringify(list.slice(0,12)));return true;}catch{toast('本機快照儲存失敗；請下載備份。');return false;}}
function persist(){state.updatedAt=Date.now();try{
  if(storageError&&localStorage.getItem(KEY)){const existing=localStorage.getItem(KEY);try{validate(JSON.parse(existing));}catch{localStorage.setItem(KEY+'-damaged-'+Date.now(),existing);}}
  localStorage.setItem(KEY,JSON.stringify(state));storageError='';
  const latest=snapshots()[0];if(!latest||Date.now()-latest.at>10*60*1000)saveSnapshot('自動儲存');
}catch{storageError='儲存失敗 · 請下載備份';toast('瀏覽器無法儲存，請立即下載進度備份。');}status();window.dispatchEvent(new Event('edf-progress-change'));}
function change(items,value){mergeLatest();const changes=items.filter(i=>owned(i)!==value).map(i=>({id:i.id,before:!!state.entries[i.id]?.owned}));if(!changes.length)return;undoStack.push(changes);undoStack=undoStack.slice(-30);const now=Date.now();for(const c of changes)state.entries[c.id]={owned:value,updatedAt:now};persist();render();}
function renderSettings(){
 for(const o of content.options)$('content-'+o.id).checked=contentEnabled(o.id);
 const children=content.options.filter(o=>o.group==='season'),count=children.filter(o=>contentEnabled(o.id)).length;
 $('seasonPass').checked=count===children.length;$('seasonPass').indeterminate=count>0&&count<children.length;
 $('seasonCount').textContent=count+' / 14 項';
}
function changeContent(keys,value){
 mergeLatest();const changes=keys.filter(id=>contentEnabled(id)!==value).map(id=>({id,before:contentEnabled(id),type:'content'}));
 if(!changes.length){renderSettings();return;}undoStack.push(changes);undoStack=undoStack.slice(-30);state.content??={};const now=Date.now();
 for(const c of changes)state.content[c.id]={enabled:value,updatedAt:now};persist();render();
}
function refreshOptions(){
 if(section==='missions'){
  const scope=$('scope'),selected=scope.value,pack=contentEnabled('mission-pack');
  scope.innerHTML='<option value="all">全部 '+(pack?120:104)+' 關</option><option value="base">本篇 M01–104</option>'+(pack?'<option value="extra">DLC EX01–16</option>':'');
  scope.value=selected==='extra'&&!pack?'all':selected;
  $('sectionNote').textContent='依攻略地區／版本推算角色候選，α／β／γ 分列並依 DLC 設定增減。武器模式合併同把武器的相關角色；角色模式只列未取得角色。候選占比不是掉落機率。';
  for(const head of document.querySelectorAll('[data-mission-target-head]'))head.textContent=missionMode==='characters'?'未取得角色':'未取得武器 / 對應角色';
  $('missionSort').querySelector('[value="weapons"]').textContent=missionMode==='characters'?'未取得角色數多 → 少':'未取得武器數多 → 少';
  $('missionFavorites').querySelector('.section-note').textContent='你的刷關捷徑 · 可搜尋、排序及篩選收藏關卡，隨上方補收模式與收集進度更新。';
  return;
 }
 const items=sectionItems(),category=$('category').value,level=$('level').value;
 $('category').innerHTML='<option value="">所有分類</option>'+[...new Set(items.map(categoryOf))].map(c=>'<option value="'+escape(c)+'">'+escape(categoriesZh[c]||c)+'</option>').join('');
 $('level').innerHTML='<option value="">'+(section==='weapons'?'所有等級':section==='characters'?'所有版本':'所有品質 / 型別')+'</option>'+[...new Set(items.map(i=>i.variant))].map(c=>'<option value="'+escape(c)+'">'+escape(section==='characters'?c+' '+(variantsZh[c]||''):section==='accessories'?variantText({kind:section,variant:c}):c)+'</option>').join('');
 $('category').value=[...$('category').options].some(o=>o.value===category)?category:'';
 $('level').value=[...$('level').options].some(o=>o.value===level)?level:'';
}
function stats(){for(const [key,s]of Object.entries(sections)){const items=sectionItems(key),n=items.filter(owned).length,pct=items.length?Math.round(n/items.length*100):0;const el=document.querySelector('[data-stat="'+key+'"]');el.classList.toggle('selected',activeView===key);el.querySelector('.percent').textContent=pct+'%';el.querySelector('.stat-number').innerHTML=n+'<small>/ '+items.length+' 項</small>';el.querySelector('.progress i').style.width=pct+'%';}}
function render(){
 hideTooltip();
 for(const key of ['dlcWeapons','dlcCharacters']){
  const hidden=sectionItems(key).length===0;
  document.querySelector('[data-tab="'+key+'"]').hidden=hidden;
  document.querySelector('[data-stat="'+key+'"]').hidden=hidden;
 }
 if(sections[activeView]?.extra&&!sectionItems().length){switchSection(sections[activeView].kind);return;}
 renderSettings();refreshOptions();
 $('missionFavorites').hidden=section!=='missions'||missionTab!=='favorites';
 $('missionRecommendedPanel').hidden=section!=='missions'||missionTab!=='recommended';
 $('missionTabs').hidden=section!=='missions';
 $('missionViewControls').hidden=section!=='missions';
 if(section==='missions'){renderMissions();return;}
 const all=sectionItems(),q=$('search').value.trim().normalize('NFKC').toLocaleLowerCase();
 current=all.filter(i=>(!$('category').value||categoryOf(i)===$('category').value)&&(!$('level').value||i.variant===$('level').value)&&(section!=='accessories'||!$('accessoryLevel').value||accessoryLevel(i)===Number($('accessoryLevel').value))&&(filter==='all'||(filter==='owned'?owned(i):!owned(i)))&&(section!=='characters'||[...characterAccessoryFilters].every(key=>characterAccessories.slots[i.id]?.includes(key)))&&matchesSearch(i,q));
 $('list').innerHTML=current.map(i=>`<tr class="${owned(i)?'owned':''}"><td><input class="item-check" type="checkbox" data-id="${escape(i.id)}" aria-label="${escape(displayName(i)+' 已取得')}" ${owned(i)?'checked':''}></td><td class="name-cell"><div class="item-name">${escape(displayName(i))}${i.extra?'<span class="extra-tag">'+escape(i.extra)+'</span>':''}</div><div class="item-translation" lang="zh-Hant">${escape(translatedName(i))}</div>${i.kind==='weapons'?'<div class="item-sub">系列：'+escape(i.family)+' / '+escape(familyZh(i.family))+'</div>':''}</td>${section!=='characters'?'<td><span class="pill">'+escape(i.variant)+'</span>'+(i.kind==='accessories'?'<div class="item-sub">'+escape(variantText(i))+'</div>':'')+'</td>':''}${section==='accessories'?'<td class="accessory-level-cell"><span class="pill">'+(accessoryLevel(i)?'LV'+accessoryLevel(i):'未記載')+'</span></td>':''}<td class="category-text">${escape(categoriesZh[categoryOf(i)]||categoryOf(i))}${categoriesZh[categoryOf(i)]&&categoriesZh[categoryOf(i)]!==categoryOf(i)?'<small>'+escape(categoryOf(i))+'</small>':''}</td>${section==='characters'?'<td class="appearance-cell">'+appearanceHtml(i)+'</td>'+characterAccessoryCells(i):section==='weapons'?'<td class="owner-cell">'+ownerHtml(i)+'</td>':''}<td><a class="source-link" href="${escape(i.source)}" target="_blank" rel="noopener" aria-label="查看 ${escape(i.name)} 攻略">Wiki ↗</a></td></tr>`).join('');
 $('results').textContent='顯示 '+current.length+' / '+all.length+' 項';$('empty').hidden=current.length>0;$('markVisible').disabled=!current.some(i=>!owned(i));$('undo').disabled=!undoStack.length;
 const n=all.filter(owned).length;$('sectionCount').textContent=n+' / '+all.length+' 已取得';stats();weaponLevelStats();accessoryCategoryStats();
}
function setupView(key){resetCharacterAccessoryFilters();$('characterAccessoryFilters').hidden=key!=='characters';document.querySelectorAll('[data-character-accessory-head]').forEach(head=>head.hidden=key!=='characters');const missions=key==='missions';document.querySelector('.toolbar').hidden=false;$('missionAllPanel').hidden=false;if(missions){$('missionAllPanel').setAttribute('role','tabpanel');$('missionAllPanel').setAttribute('aria-labelledby','missionTab-all');}else{$('missionAllPanel').removeAttribute('role');$('missionAllPanel').removeAttribute('aria-labelledby');}document.body.dataset.section=key;$('collectionTable').hidden=missions;$('missionTable').hidden=!missions;$('missionControls').hidden=!missions;$('category').hidden=missions||key==='accessories';$('level').hidden=missions;$('accessoryLevel').hidden=key!=='accessories';$('accessoryLevelHead').hidden=key!=='accessories';$('accessoryLevel').value='';$('filter').hidden=missions;$('markVisible').hidden=missions;$('missionOther').hidden=true;$('list').innerHTML='';$('missionList').innerHTML='';$('scope').innerHTML=missions?'<option value="all">全部 120 關</option><option value="base">本篇 M01–104</option><option value="extra">DLC EX01–16</option>':'<option value="all">完整清單</option><option value="base">本篇項目</option><option value="extra">DLC／特典</option>';$('search').placeholder=missions?'搜尋關卡、未取得武器或角色…':'搜尋中日名稱、出處角色、M20…';document.querySelector('.list-footer>span').textContent=missions?'固定候選數不隨進度改變 · 展開關卡可查看並勾選武器':'勾選即自動存檔 · 每項可再次點擊取消';document.querySelector('.table-scroll').scrollTop=0;if(missions){$('sectionTitle').textContent='關卡清單';$('sectionKicker').textContent='FARMING';$('sectionNote').textContent='依攻略地區／版本推算候選（包含需解鎖與角色 DLC，αβγ 分列）；只列目前未取得的指定 LV 武器。候選占比不是掉落機率；難度與金武器解鎖條件仍需對照遊戲。';document.querySelectorAll('#tabs button').forEach(b=>{b.classList.toggle('active',b.dataset.tab===key);b.setAttribute('aria-current',b.dataset.tab===key?'page':'false');});}}
function missionData(){
 const missing=availableItems().filter(w=>w.kind==='weapons'&&w.variant==='Lv.'+missionLevel&&!owned(w)),byOwner=new Map();
 for(const w of missing)if(acquisitionOf(w).method==='rescue')for(const n of details.weaponFamilies[w.family]?.owners||[]){if(!byOwner.has(n))byOwner.set(n,[]);byOwner.get(n).push(w);}
 return {missing,rows:missionCatalog.rows.filter(m=>!m.extra||contentEnabled('mission-pack')).map(original=>{
  const m={...original,candidates:original.candidates.filter(available)};
  const targets=m.candidates.filter(c=>byOwner.has(c.name)).map(c=>({character:c,weapons:byOwner.get(c.name)}));
  const boxes=missing.filter(w=>acquisitionOf(w).method==='box'&&acquisitionOf(w).missions?.some(x=>x.extra===m.extra&&x.number===m.number));
  const grouped=new Map();for(const t of targets)for(const w of t.weapons){if(!grouped.has(w.id))grouped.set(w.id,{weapon:w,characters:[]});grouped.get(w.id).characters.push(t.character);}
  const weaponTargets=[...grouped.values()],weapons=[...new Map([...weaponTargets.map(t=>t.weapon),...boxes].map(w=>[w.id,w])).values()];
  const missingCharacters=m.candidates.filter(c=>!owned(c)),targetCount=missionMode==='characters'?missingCharacters.length:targets.length;
  return {...m,targets,boxes,weapons,weaponTargets,missingCharacters,usefulCount:missionMode==='characters'?missingCharacters.length:weapons.length,coverage:m.candidates.length?targetCount/m.candidates.length:0};
 })};
}

const retainedMissionWeapons=new Map();
function retainedKey(view,code){return view+':'+code+':'+missionLevel;}
function visibleWeaponTargets(m,view){
 const targets=new Map(m.weaponTargets.map(t=>[t.weapon.id,t]));
 if(missionMode==='weapons')for(const id of retainedMissionWeapons.get(retainedKey(view,m.code))||[]){
  const weapon=catalog.items.find(w=>w.id===id&&available(w));if(!weapon||targets.has(id))continue;
  const owners=details.weaponFamilies[weapon.family]?.owners||[],characters=m.candidates.filter(c=>owners.includes(c.name));
  if(characters.length)targets.set(id,{weapon,characters});
 }
 return [...targets.values()];
}
function weaponChecklist(w,context=''){return `<label class="mission-weapon"><input class="item-check" type="checkbox" data-id="${escape(w.id)}" aria-label="${escape(w.name+' 已取得')}" ${owned(w)?'checked':''}><span>${escape(w.name)}<small>${escape(nameZh(w.name))}${context?' · '+escape(context):''}</small></span><a class="source-link" href="${escape(w.source)}" target="_blank" rel="noopener">Wiki ↗</a></label>`;}
function missionFocusEnabled(){return missionMode==='weapons'&&$('missionFocus').checked;}
function missionFocusContent(m){
 const groups=new Map();
 for(const {character,weapons} of m.targets){
  if(!groups.has(character.name))groups.set(character.name,{characters:[],weapons:new Map()});
  const group=groups.get(character.name);group.characters.push(character);
  for(const weapon of weapons)group.weapons.set(weapon.id,weapon);
 }
 const rescue=groups.size?'<ul class="mission-focus-list">'+[...groups].map(([name,group])=>{
  const versions=[...new Set(group.characters.map(characterSuffix).filter(Boolean))].join('／');
  return `<li data-focus-character="${escape(name)}"><strong>${escape(name)}${versions?'<span class="mission-focus-versions"> '+escape(versions)+'</span>':''}</strong>：<span>${[...group.weapons.values()].map(w=>escape(w.name)).join('、')}</span><small>${escape(nameZh(name))}：${[...group.weapons.values()].map(w=>escape(nameZh(w.name))).join('、')}</small></li>`;
 }).join('')+'</ul>':'<p class="appearance-note">'+(m.noRescue?'此關不出現救出角色':m.known?'此 LV 已無可對應的補收武器':'攻略未提供此關分布，請以遊戲任務簡報核對')+'</p>';
 const boxes=m.boxes.length?'<div class="mission-focus-boxes"><strong>武器箱（與救出角色無關）</strong><ul>'+m.boxes.map(w=>'<li>'+escape(w.name)+'<small>'+escape(nameZh(w.name))+' · '+escape(acquisitionOf(w).missions.filter(x=>x.extra===m.extra&&x.number===m.number).map(x=>x.difficulty).join('／'))+'</small></li>').join('')+'</ul></div>':'';
 return rescue+boxes;
}
function missionContent(m,view='missionList'){
 if(missionFocusEnabled())return missionFocusContent(m);
 if(missionMode==='characters')return '<div class="mission-target-grid character-target-grid">'+m.missingCharacters.map(c=>`<article class="mission-target character-target" data-character-id="${escape(c.id)}"><label class="mission-character-check"><input class="item-check" type="checkbox" data-id="${escape(c.id)}" aria-label="${escape(displayName(c)+' 已取得')}"><span><strong>${escape(displayName(c))}</strong><small>${escape(translatedName(c))}</small></span></label><a class="source-link" href="${escape(c.source)}" target="_blank" rel="noopener">Wiki ↗</a></article>`).join('')+'</div>';
 return '<div class="mission-target-grid">'+visibleWeaponTargets(m,view).map(t=>{
  const owners=new Map();for(const c of t.characters){if(!owners.has(c.name))owners.set(c.name,[]);owners.get(c.name).push(c);}
  const characters=[...owners].map(([name,cs])=>{const meta=characterMeta(name),uncertain=m.uncertain.includes(meta.pool)||/尚未確定/.test(meta.note);
   return '<div class="mission-owner-group"><span class="mission-owner-name">'+escape(nameZh(name))+(uncertain?'？':'')+'</span><span class="mission-owner-versions">'+cs.map(c=>`<label class="mission-owner-version${owned(c)?' owned':''}" title="${escape(displayName(c))}"><input class="item-check" type="checkbox" data-id="${escape(c.id)}" aria-label="${escape(displayName(c)+' 已取得')}" ${owned(c)?'checked':''}><span>${escape(characterSuffix(c)||'α')}${owned(c)?' 已取得':''}</span></label>`).join('')+'</span></div>';
  }).join('');
  return `<article class="mission-target weapon-target${owned(t.weapon)?' recently-owned':''}" data-weapon-id="${escape(t.weapon.id)}">${weaponChecklist(t.weapon)}${owned(t.weapon)?'<div class="retained-note">武器已取得 · 可繼續勾選這次救到的角色</div>':''}<div class="mission-owner-list"><span class="mission-owner-label">此關相關角色 · 分別勾選實際取得的版本</span>${characters}</div></article>`;
 }).join('')+'</div>'+(m.boxes.length?'<div class="mission-boxes"><strong>DLC 武器箱 · 與救出角色無關</strong>'+m.boxes.map(w=>weaponChecklist(w,acquisitionOf(w).missions.filter(x=>x.extra===m.extra&&x.number===m.number).map(x=>x.difficulty).join('／'))).join('')+'</div>':'');
}

function missionRow(m,open=false,view='missionList'){
 const isFavoriteView=view==='favoriteMissionList',isRecommendedView=view==='recommendedMissionList',recommendation=recommendationByCode.get(m.code);
 const characters=missionMode==='characters',displayTargets=visibleWeaponTargets(m,view),count=characters?m.usefulCount:displayTargets.length+m.boxes.length;
 const preview=missionFocusEnabled()?[...new Set(m.targets.map(t=>nameZh(t.character.name)))].slice(0,2):characters?m.missingCharacters.slice(0,2).map(translatedName):[...displayTargets.map(t=>t.weapon),...m.boxes].slice(0,2).map(w=>nameZh(w.name));
 return `<tr data-${isFavoriteView?'favorite-row':isRecommendedView?'recommended-row':'mission-row'}="${m.code}"><td class="mission-code"><div class="mission-title"><button class="favorite-star" data-favorite-mission="${m.code}" aria-pressed="${favorite(m.code)}" aria-label="${favorite(m.code)?'取消':'加入'} ${m.code} 我的最愛">${favorite(m.code)?'★':'☆'}</button><strong>${m.code}</strong></div><small>${m.extra?'DLC':'本篇'}</small>${isRecommendedView?'<span class="recommended-title">'+escape(recommendation.title)+'</span>':''}</td><td class="mission-fixed"><strong data-fixed-count>${m.known?m.candidates.length+' 名角色':'未記載'}</strong><small>${m.noRescue?'無救出角色':m.known?'α／β／γ 分列 · 依 DLC 設定':'角色分布待確認'}</small>${m.uncertain.length?'<small>含攻略「？」資料</small>':''}</td><td><div class="mission-summary">${m.noRescue?'無救出角色':m.known?characters?`未取得角色 <b>${count} / ${m.candidates.length} 名</b> · ${Math.round(m.coverage*100)}%`:`未取得武器 <b>武器LV${missionLevel}：${m.weapons.length} 把</b>`:'救出分布待確認'}<span>${characters?'依角色版本補漏':`補收候選角色 ${m.targets.length} / ${m.candidates.length} 名 · ${Math.round(m.coverage*100)}%${m.boxes.length?' · 含 '+m.boxes.length+' 把 DLC 武器箱':''}`}</span></div>${count?`<details class="mission-details" data-mission="${m.code}" ${open?'open':''}><summary>${missionFocusEnabled()?'查看角色與未取得武器':characters?'查看未取得角色':m.weapons.length?'查看未取得武器':'繼續勾選相關角色'} · ${preview.map(escape).join('、')}${count>2?'…':''}</summary><div class="mission-content">${open?missionContent(m,view):''}</div></details>`:`<div class="appearance-note">${m.noRescue?'此關不出現救出角色':m.known?characters?'此關候選角色皆已取得':'此 LV 已無可對應的補收武器':'攻略未提供此關分布，請以遊戲任務簡報核對'}</div>`}</td>${isFavoriteView?`<td class="mission-note-cell"><label><span class="mobile-column-label">筆記</span><textarea data-mission-note="${m.code}" aria-label="${m.code} 筆記" maxlength="5000" rows="3" placeholder="記下隊伍、路線或待收集目標…">${escape(missionNote(m.code))}</textarea></label><small>自動儲存 · 最多 5000 字</small></td>`:isRecommendedView?`<td class="mission-reason"><span class="mobile-column-label">推薦原因</span>${escape(recommendation.reason)}</td>`:''}</tr>`;
}

function renderFavorites(visible,rows){
 const previous=new Map([...$('favoriteMissionList').querySelectorAll('.mission-details')].map(d=>[d.dataset.mission,d.open]));
 const total=rows.filter(m=>favorite(m.code)).length,favorites=visible.filter(m=>favorite(m.code));
 $('favoriteMissionList').innerHTML=favorites.map(m=>missionRow(m,previous.get(m.code)??false,'favoriteMissionList')).join('');
 $('favoriteCount').textContent=favorites.length+' / '+total+' 關 · '+(missionMode==='characters'?'角色':'武器LV'+missionLevel);
 $('favoriteEmpty').hidden=!!favorites.length;
 $('favoriteEmpty').textContent=total?'沒有符合搜尋或篩選的收藏關卡，試試調整條件。':'點一下關卡名稱前的 ☆，就會加入這裡。收藏與筆記會自動儲存並納入備份。';
 $('favoriteClearFilters').hidden=!total||!!favorites.length;
 $('favoriteMissionTable').hidden=!favorites.length;document.body.dataset.hasFavorites=String(!!total);
 $('favoriteMissionList').querySelectorAll('textarea').forEach(resizeNote);
}
function filterMissionRows(rows,q,view){
 const visible=rows.filter(m=>($('scope').value==='all'||($('scope').value==='extra'?m.extra:!m.extra))
  &&(!$('missionOnlyUseful').checked||m.usefulCount>0||(missionMode==='weapons'&&visibleWeaponTargets(m,view).some(t=>owned(t.weapon))))
  &&(!q||[m.code,...(missionMode==='characters'?m.missingCharacters:m.targets.map(t=>t.character)).flatMap(c=>[displayName(c),translatedName(c)]),
   ...(missionMode==='characters'?[]:[...visibleWeaponTargets(m,view).map(t=>t.weapon),...m.boxes]).flatMap(w=>[w.name,nameZh(w.name)]),
   ...(view==='favoriteMissionList'?[missionNote(m.code)]:[]),
   ...(view==='recommendedMissionList'?[recommendationByCode.get(m.code)?.title||'',recommendationByCode.get(m.code)?.reason||'']:[])
  ].join(' ').normalize('NFKC').toLocaleLowerCase().includes(q)));
 const sort=$('missionSort').value;
 if(sort==='coverage')visible.sort((a,b)=>b.coverage-a.coverage||b.usefulCount-a.usefulCount);
 if(sort==='weapons')visible.sort((a,b)=>b.usefulCount-a.usefulCount||b.coverage-a.coverage);
 return visible;
}
function renderMissions(){
 const noteFocus=document.activeElement?.matches('[data-mission-note]')?{code:document.activeElement.dataset.missionNote,start:document.activeElement.selectionStart,end:document.activeElement.selectionEnd,undo:document.activeElement.noteUndo}:null;
 const openKeys=new Set([...document.querySelectorAll('#missionList .mission-details[open],#favoriteMissionList .mission-details[open],#recommendedMissionList .mission-details[open]')].map(d=>retainedKey(d.closest('tbody').id,d.dataset.mission)));
 for(const key of retainedMissionWeapons.keys())if(!openKeys.has(key))retainedMissionWeapons.delete(key);
 const opened=new Set([...$('missionList').querySelectorAll('details[open]')].map(x=>x.dataset.mission));
 const {missing,rows}=missionData(),q=$('search').value.trim().normalize('NFKC').toLocaleLowerCase();missionRows=rows;
 const visible=filterMissionRows(rows,q,'missionList'),favoriteVisible=filterMissionRows(rows,q,'favoriteMissionList'),recommendedVisible=filterMissionRows(rows,q,'recommendedMissionList');
 $('missionList').innerHTML=visible.map(m=>missionRow(m,opened.has(m.code))).join('');
 renderFavorites(favoriteVisible,rows);renderRecommended(recommendedVisible);updateMissionPanels();
 const nonRescue=missing.filter(w=>acquisitionOf(w).method!=='rescue'&&(!acquisitionOf(w).missions?.length));const unmapped=missing.filter(w=>acquisitionOf(w).method==='rescue'&&!rows.some(m=>m.weapons.some(x=>x.id===w.id)));const other=[...nonRescue,...unmapped];$('missionOther').hidden=missionTab!=='all'||missionMode==='characters'||!other.length;$('missionOther').innerHTML=other.length?`<details><summary>另有 ${other.length} 把 LV${missionLevel}：購買／通關數獎勵／未能對應救出關卡（不混入候選角色）</summary><div class="mission-other-content">${other.map(w=>weaponChecklist(w,acquisitionOf(w).note||'救出關卡未記載')).join('')}</div></details>`:'';$('sectionCount').textContent='本篇 104 關'+(contentEnabled('mission-pack')?' ＋ DLC 16 關':'');$('results').textContent='顯示 '+(missionTab==='favorites'?favoriteVisible.filter(m=>favorite(m.code)).length:missionTab==='recommended'?recommendedVisible.filter(m=>recommendationByCode.has(m.code)).length:visible.length)+' / '+(missionTab==='recommended'?recommendations.rows.length:missionTab==='favorites'?rows.filter(m=>favorite(m.code)).length:rows.length)+' 關 · '+(missionMode==='characters'?'未取得角色 '+availableItems().filter(i=>i.kind==='characters'&&!owned(i)).length+' 名':'武器LV'+missionLevel+' 未取得 '+missing.length+' 把');$('empty').hidden=missionTab!=='all'||visible.length>0;$('undo').disabled=!undoStack.length;stats();weaponLevelStats();accessoryCategoryStats();
 $('missionOther').querySelector('details')?.toggleAttribute('open',missionOtherExpanded);
 if(noteFocus&&missionTab==='favorites'){const input=$('favoriteMissionList').querySelector('[data-mission-note="'+noteFocus.code+'"]');if(input){input.focus({preventScroll:true});input.setSelectionRange(noteFocus.start,noteFocus.end);input.noteUndo=noteFocus.undo;}}
}
function renderRecommended(rows){
 const previous=new Set([...$('recommendedMissionList').querySelectorAll('.mission-details[open]')].map(d=>d.dataset.mission));
 const missions=rows.filter(m=>recommendationByCode.has(m.code));
 $('recommendedMissionList').innerHTML=missions.map(m=>missionRow(m,previous.has(m.code),'recommendedMissionList')).join('');
 $('recommendedEmpty').hidden=!!missions.length;
}
function updateMissionPanels(){
 $('missionFocus').disabled=missionMode!=='weapons';
 $('missionFocusHint').textContent=missionMode==='weapons'?'展開關卡，以「角色：武器」條列確認救援目標。':'切換至武器 LV 模式可使用重點查看。';
 $('missionAllPanel').hidden=missionTab!=='all';$('missionRecommendedPanel').hidden=missionTab!=='recommended';$('missionFavorites').hidden=missionTab!=='favorites';
 document.querySelector('.toolbar').hidden=false;$('missionControls').hidden=false;
 $('search').placeholder=missionTab==='favorites'?'搜尋收藏關卡、未取得武器、角色或筆記…':'搜尋關卡、未取得武器或角色…';
 document.querySelectorAll('[data-mission-tab]').forEach(b=>{const selected=b.dataset.missionTab===missionTab;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;});
 if(missionTab==='favorites')$('favoriteMissionList').querySelectorAll('textarea').forEach(resizeNote);
}
function switchMissionTab(tab){missionTab=tab;render();}
function switchSection(view){retainedMissionWeapons.clear();activeView=view;const key=sections[view]?.kind||view;section=key;filter='missing';$('search').value='';$('scope').value='all';setupView(key);$('scope').hidden=key!=='missions';if(key==='missions'){render();return;}const s=sections[view];$('sectionTitle').textContent=s.title;$('sectionKicker').textContent=s.kicker;$('sectionNote').textContent=(s.extra?'僅列 DLC／特典，不計入本篇收集進度。':key==='accessories'?'':'僅列本篇項目，DLC／特典請切換下排頁籤。')+s.note+(key==='weapons'?' 出處角色可懸停／點擊查看候選關卡；DLC 武器箱與通關數獎勵另列。':key==='characters'?' 關卡是地區＋版本的隨機救出候選，非保證出現；「？」為攻略不確定資料。':'')+' 中文為參考譯名，可對照上方原文。';$('variantHead').textContent=key==='weapons'?'等級':'品質 / 型別';$('variantHead').hidden=key==='characters';$('detailHead').hidden=key==='accessories';$('detailHead').textContent=key==='characters'?'出現關卡 / 加入條件':'取得方式 / 出處角色 ⓘ';$('nameHead').textContent=key==='weapons'?'名稱 / 系列':'名稱';
 const items=sectionItems();$('category').innerHTML='<option value="">所有分類</option>'+[...new Set(items.map(categoryOf))].map(c=>'<option value="'+escape(c)+'">'+escape(categoriesZh[c]||c)+'</option>').join('');$('level').innerHTML='<option value="">'+(key==='weapons'?'所有等級':key==='characters'?'所有版本':'所有品質 / 型別')+'</option>'+[...new Set(items.map(i=>i.variant))].map(c=>'<option value="'+escape(c)+'">'+escape(key==='characters'?c+' '+(variantsZh[c]||''):key==='accessories'?variantText({kind:key,variant:c}):c)+'</option>').join('');
 document.body.dataset.section=key;$('accessoryLevel').value='';$('accessoryLevel').hidden=key!=='accessories';$('accessoryLevelHead').hidden=key!=='accessories';
 document.querySelectorAll('#tabs button').forEach(b=>{b.classList.toggle('active',b.dataset.tab===view);b.setAttribute('aria-current',b.dataset.tab===view?'page':'false');});document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));render();
}
function download(data){const now=new Date(),time=[now.getHours(),now.getMinutes(),now.getSeconds()].map(n=>String(n).padStart(2,'0')).join('-');const blob=new Blob([JSON.stringify({...data,exportedAt:now.toISOString()},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='edfwb2-progress-'+now.toLocaleDateString('sv-SE')+'_'+time+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
function backupInfo(){try{const t=localStorage.getItem(META);$('lastBackup').textContent=t?new Date(Number(t)).toLocaleString('zh-TW'):'尚未備份';}catch{$('lastBackup').textContent='無法讀取備份時間';}const list=snapshots();$('snapshots').innerHTML=list.map((x,i)=>'<option value="'+i+'">'+escape(new Date(x.at).toLocaleString('zh-TW')+' · '+x.label+' · '+Object.values(x.data.entries).filter(e=>e.owned).length+' 項')+'</option>').join('');$('restoreSnapshot').disabled=!list.length;}
function applyImport(data,mode,{requireSnapshot=false}={}){mergeLatest();if(!saveSnapshot('匯入前')&&requireSnapshot)throw Error('無法保留本機快照，已停止雲端還原。請先匯出備份。');const changes=catalog.items.map(i=>({id:i.id,before:owned(i)}));if(data.content!==undefined)changes.push(...[...contentIds].map(id=>({id,before:contentEnabled(id),type:'content'})));if(data.favorites!==undefined)changes.push(...[...missionIds].map(id=>({id,before:favorite(id),type:'favorite'})));if(data.missionNotes!==undefined)changes.push(...[...missionIds].map(id=>({id,before:missionNote(id),type:'note'})));undoStack.push(changes);const now=Date.now();for(const i of catalog.items){if(mode==='merge'){if(data.entries[i.id]?.owned)state.entries[i.id]={owned:true,updatedAt:now};}else state.entries[i.id]={owned:!!data.entries[i.id]?.owned,updatedAt:now};}if(data.favorites!==undefined){state.favorites??={};for(const id of missionIds)if(mode==='replace'||data.favorites[id]?.favorite)state.favorites[id]={favorite:!!data.favorites[id]?.favorite,updatedAt:now};}if(data.content!==undefined){state.content??={};for(const id of contentIds)if(mode==='replace'||data.content[id]?.enabled)state.content[id]={enabled:!!data.content[id]?.enabled,updatedAt:now};}if(data.missionNotes!==undefined){state.missionNotes??={};for(const id of missionIds){const note=data.missionNotes[id];if(mode==='replace')state.missionNotes[id]={text:note?.text||'',updatedAt:now};else if(note&&(!state.missionNotes[id]||note.updatedAt>state.missionNotes[id].updatedAt))state.missionNotes[id]={text:note.text,updatedAt:now};}}persist();render();backupInfo();$('backupMessage').textContent=mode==='merge'?'已合併取得進度、收藏、筆記與使用者設定。':'已還原備份（舊版備份會保留未提供的收藏、筆記與使用者設定）。';$('importPreview').hidden=true;pendingImport=null;}
for(const [key,s]of Object.entries(sections)){$('tabs').insertAdjacentHTML('beforeend',`<button data-tab="${key}"><span>${s.icon}</span><span>${s.short}清單</span><small>${s.kicker.split(' ')[0]}</small></button>`);$('stats').insertAdjacentHTML('beforeend',`<button class="stat" data-stat="${key}" aria-label="查看${s.short}清單"><div class="stat-top"><span>${s.short}收集</span><span class="percent">0%</span></div><div class="stat-number"></div><div class="progress"><i></i></div></button>`);}
$('tabs').insertAdjacentHTML('beforeend','<button data-tab="missions"><span>▤</span><span>關卡清單</span><small>FARMING</small></button>');
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>switchSection(b.dataset.tab));document.querySelectorAll('[data-stat]').forEach(b=>b.onclick=()=>switchSection(b.dataset.stat));
$('list').onchange=e=>{const i=catalog.items.find(i=>i.id===e.target.dataset.id);if(i)change([i],e.target.checked);};
$('list').onclick=e=>{const owner=e.target.closest('.owner-button');if(owner){showTooltip(owner,true);return;}if(e.target.closest('input,a,button,summary'))return;const checkbox=e.target.closest('tr')?.querySelector('.item-check');if(checkbox){const i=catalog.items.find(i=>i.id===checkbox.dataset.id);if(i)change([i],!owned(i));}};
for(const id of ['search','category','level','accessoryLevel','scope'])$(id).addEventListener(id==='search'?'input':'change',render);
$('weaponLevelStats').onclick=e=>{const character=e.target.closest('[data-mission-mode]');if(character&&section==='missions'){retainedMissionWeapons.clear();missionMode='characters';render();return;}const b=e.target.closest('[data-weapon-level]');if(!b)return;if(section==='missions'){retainedMissionWeapons.clear();missionMode='weapons';missionLevel=Number(b.dataset.weaponLevel);render();return;}const value='Lv.'+b.dataset.weaponLevel;$('level').value=$('level').value===value?'':value;render();};
$('characterAccessoryFilters').addEventListener('change',e=>{
 const key=e.target.dataset.characterAccessoryFilter;if(!characterAccessories.categories.some(c=>c.key===key))return;
 if(e.target.checked)characterAccessoryFilters.add(key);else characterAccessoryFilters.delete(key);
 $('clearCharacterAccessories').disabled=!characterAccessoryFilters.size;render();
});
$('clearCharacterAccessories').onclick=()=>{resetCharacterAccessoryFilters();render();};
$('accessoryCategoryStats').onclick=e=>{const b=e.target.closest('[data-accessory-category]');if(!b)return;const value=b.dataset.accessoryCategory;$('category').value=$('category').value===value?'':value;render();};
$('missionFocus').onchange=()=>{retainedMissionWeapons.clear();render();};
$('favoriteClearFilters').onclick=()=>{$('search').value='';$('scope').value='all';$('missionOnlyUseful').checked=false;render();};
$('missionSort').onchange=render;$('missionOnlyUseful').onchange=render;
$('missionTabs').onclick=e=>{const b=e.target.closest('[data-mission-tab]');if(b)switchMissionTab(b.dataset.missionTab);};
$('missionTabs').onkeydown=e=>{
 if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
 const tabs=[...$('missionTabs').querySelectorAll('[role="tab"]')],index=tabs.indexOf(document.activeElement);if(index<0)return;
 e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
 switchMissionTab(tabs[next].dataset.missionTab);tabs[next].focus();
};
$('favoriteMissionList').addEventListener('input',e=>{if(e.target.matches('[data-mission-note]')){saveMissionNote(e.target);resizeNote(e.target);}});
$('favoriteMissionList').addEventListener('focusout',e=>{if(e.target.matches('[data-mission-note]'))e.target.noteUndo=false;});
$('missionOther').addEventListener('toggle',e=>{if(e.target.tagName==='DETAILS')missionOtherExpanded=e.target.open;},true);
for(const id of ['missionList','favoriteMissionList','recommendedMissionList']){
 $(id).addEventListener('toggle',e=>{const d=e.target.closest('.mission-details');if(!d?.isConnected)return;if(d.open){const m=missionRows.find(x=>x.code===d.dataset.mission);if(m&&!d.querySelector('.mission-content').innerHTML)d.querySelector('.mission-content').innerHTML=missionContent(m,id);}else if(retainedMissionWeapons.delete(retainedKey(id,d.dataset.mission)))render();},true);
 $(id).addEventListener('click',e=>{const b=e.target.closest('[data-favorite-mission]');if(b)toggleFavorite(b.dataset.favoriteMission);});
}
for(const id of ['missionList','missionOther','favoriteMissionList','recommendedMissionList'])$(id).addEventListener('change',e=>{const w=catalog.items.find(i=>i.id===e.target.dataset.id&&available(i)&&['weapons','characters'].includes(i.kind));if(w){
 if(missionMode==='weapons'&&w.kind==='weapons'&&e.target.checked&&e.target.closest('.weapon-target')){
  for(const view of ['missionList','favoriteMissionList','recommendedMissionList'])for(const d of $(view).querySelectorAll('.mission-details[open]'))if(d.querySelector('[data-weapon-id="'+w.id+'"]')){
   const key=retainedKey(view,d.dataset.mission);if(!retainedMissionWeapons.has(key))retainedMissionWeapons.set(key,new Set());retainedMissionWeapons.get(key).add(w.id);
  }
 }
 change([w],e.target.checked);
 }});
$('filter').onclick=e=>{const b=e.target.closest('[data-filter]');if(!b)return;filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));render();};
$('undo').onclick=()=>{const changes=undoStack.pop();if(!changes)return;mergeLatest();for(const c of changes){if(c.type==='content'){state.content??={};state.content[c.id]={enabled:c.before,updatedAt:Date.now()};}else if(c.type==='note'){state.missionNotes??={};state.missionNotes[c.id]={text:c.before,updatedAt:Date.now()};}else if(c.type==='favorite'){state.favorites??={};state.favorites[c.id]={favorite:c.before,updatedAt:Date.now()};}else state.entries[c.id]={owned:c.before,updatedAt:Date.now()};}persist();render();toast('已復原上一步。');};
$('markVisible').onclick=()=>{const list=current.filter(i=>!owned(i));if(list.length&&confirm('將目前顯示的 '+list.length+' 個未取得項目全部標記為已取得？')){saveSnapshot('批次勾選前');change(list,true);toast('已勾選 '+list.length+' 項，可以復原。');}};
$('clearFilters').onclick=()=>switchSection(activeView);$('backupOpen').onclick=()=>{backupInfo();$('backupDialog').showModal();};$('helpOpen').onclick=()=>$('helpDialog').showModal();
$('export').onclick=()=>{mergeLatest();download(state);try{localStorage.setItem(META,String(Date.now()));}catch{}backupInfo();$('backupMessage').textContent='已送出備份下載，請確認檔案已存到下載資料夾。';};
$('importFile').onchange=async e=>{pendingImport=null;$('importPreview').hidden=true;try{const file=e.target.files[0];if(!file)return;if(file.size>5*1024*1024)throw Error('檔案太大，請選擇本工具匯出的 JSON 備份。');const {data,unknown}=validate(JSON.parse(await file.text()));pendingImport=data;const n=Object.values(data.entries).filter(x=>x.owned).length;$('importDescription').textContent='這份備份包含 '+n+' 個已取得項目。'+(unknown?'另有 '+unknown+' 個不在目前清單中的項目，匯入時會略過。':'');$('importPreview').hidden=false;$('backupMessage').textContent='';}catch(err){$('backupMessage').textContent=err.message==='Unexpected end of JSON input'?'備份檔不完整，未修改進度。':err.message;}finally{e.target.value='';}};
$('merge').onclick=()=>{if(pendingImport)applyImport(pendingImport,'merge');};$('replace').onclick=()=>{if(pendingImport&&confirm('還原會把目前進度改成這份備份，包括取消備份中未取得的項目。確定還原？'))applyImport(pendingImport,'replace');};
$('restoreSnapshot').onclick=()=>{const x=snapshots()[Number($('snapshots').value)];if(x&&confirm('將目前進度還原至 '+new Date(x.at).toLocaleString('zh-TW')+'？'))applyImport(validate(x.data).data,'replace');};
window.addEventListener('storage',e=>{if(e.key===KEY){mergeLatest();render();toast('已同步另一個分頁的進度。');}});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)&&!document.querySelector('dialog[open]')){e.preventDefault();$('search').focus();}});
let tooltipButton=null,tooltipTimer=null,tooltipPinned=false;
function hideTooltip(){clearTimeout(tooltipTimer);$('appearanceTooltip').hidden=true;tooltipButton=null;tooltipPinned=false;}
function tooltipContent(name){const c=characterMeta(name);if(!c)return `<strong>${escape(nameZh(name))}</strong><p>攻略尚未記載救出分布。</p>`;return `<strong>${escape(nameZh(name))}</strong><div class="tooltip-original">${escape(name)}</div>${c.note?'<p class="tooltip-condition">'+escape(c.note)+(/特典/.test(c.note)?'；需導入對應特典角色才可救出':'')+'</p>':''}${c.variants.map(v=>'<div class="tooltip-variant"><b>'+escape(/[αβγ]$/.test(name)?'救出枠 α':v)+'：</b>'+escape(rangeText(name,v)||'尚未記載救出關卡')+'</div>').join('')}<div class="tooltip-footnote">隨機救出候選，非保證掉落。M99–102、M104 無救出角色。武器等級另受取得條件影響。</div>`;}
function showTooltip(button,pin=false){clearTimeout(tooltipTimer);if(pin&&tooltipButton===button&&tooltipPinned){hideTooltip();return;}tooltipButton=button;tooltipPinned=pin;const box=$('appearanceTooltip');box.innerHTML=tooltipContent(button.dataset.owner);box.hidden=false;box.style.maxWidth=Math.min(420,innerWidth-24)+'px';const r=button.getBoundingClientRect(),br=box.getBoundingClientRect();box.style.left=Math.max(12,Math.min(r.left,innerWidth-br.width-12))+'px';const top=r.bottom+10+br.height<innerHeight?r.bottom+10:r.top-br.height-10;box.style.top=Math.max(12,Math.min(top,innerHeight-br.height-12))+'px';}
$('list').addEventListener('pointerover',e=>{if(e.pointerType==='touch')return;const b=e.target.closest('.owner-button');if(b&&b!==tooltipButton)showTooltip(b);});
$('list').addEventListener('pointerout',e=>{const b=e.target.closest('.owner-button');if(b&&!b.contains(e.relatedTarget)&&!tooltipPinned)tooltipTimer=setTimeout(hideTooltip,180);});
$('list').addEventListener('focusin',e=>{const b=e.target.closest('.owner-button');if(b)showTooltip(b);});
$('list').addEventListener('focusout',e=>{if(e.target.closest('.owner-button')&&!tooltipPinned)hideTooltip();});
$('appearanceTooltip').onpointerenter=()=>clearTimeout(tooltipTimer);$('appearanceTooltip').onpointerleave=()=>{if(!tooltipPinned)hideTooltip();};
document.addEventListener('click',e=>{if(!e.target.closest('.owner-button,#appearanceTooltip'))hideTooltip();});document.addEventListener('keydown',e=>{if(e.key==='Escape')hideTooltip();});window.addEventListener('resize',hideTooltip);document.querySelector('.table-scroll').addEventListener('scroll',hideTooltip);
function matchesSearch(i,q){if(!q)return true;const owners=details.weaponFamilies[i.family]?.owners||[],a=i.kind==='weapons'?acquisitionOf(i):null;const query=q.match(/^(m|ex\.?)(\d{1,3})$/i);if(query){const n=+query[2],extra=query[1].toLowerCase().startsWith('ex');if(a&&a.method!=='rescue')return a.missions?.some(m=>m.extra===extra&&m.number===n)||false;const names=i.kind==='characters'?[i.name]:owners;return names.some(name=>(i.kind==='characters'?[i.variant]:(characterMeta(name)?.variants||[])).some(v=>candidateGroups(name,v).some(g=>g.extra===extra&&n>=g.start&&n<=g.end)))||(i.kind==='characters'&&!extra&&new RegExp('M0?'+n+'(?!\\d)').test(characterMeta(i.name)?.note||''));}return [displayName(i),translatedName(i),i.family,familyZh(i.family),categoryOf(i),categoriesZh[categoryOf(i)],i.variant,...owners,...owners.map(nameZh),a?.note||'',i.kind==='characters'?characterMeta(i.name)?.note:''].join(' ').normalize('NFKC').toLocaleLowerCase().includes(q);}
setupSettings();switchSection(section);status();if(storageError)toast(recovered?'主要存檔異常，已讀取最近快照。請下載備份。':'存檔讀取異常；原始資料保留，請查看備份與還原。');
if('serviceWorker'in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>{});

function setupSettings(){
 const optionHtml=o=>{
  const characters=catalog.items.filter(i=>i.kind==='characters'&&content.requirements[i.id]===o.id),weapons=catalog.items.filter(i=>i.kind==='weapons'&&content.requirements[i.id]===o.id);
  const label=nameZh(o.name),note=[characters.length?characters.length+' 名角色':'',weapons.length?weapons.length+' 把武器':'',o.id==='mission-pack'?'16 關 EX':''].filter(Boolean).join(' · ');
  return '<label class="content-option"><input type="checkbox" id="content-'+o.id+'" data-content="'+o.id+'"><span><strong>'+escape(label)+'</strong>'+(label!==o.name?'<small>'+escape(o.name)+'</small>':'')+'<small>'+escape(note||'加入角色救出候選')+'</small></span></label>';
 };
 $('seasonChildren').innerHTML=content.options.filter(o=>o.group==='season').map(optionHtml).join('');
 $('purchaseOptions').innerHTML=content.options.filter(o=>o.group==='purchase').map(optionHtml).join('');
 $('bonusOptions').innerHTML=content.options.filter(o=>o.group==='bonus').map(optionHtml).join('');
 $('settingsOpen').onclick=()=>{renderSettings();$('settingsDialog').showModal();};
 $('settingsDialog').addEventListener('change',e=>{
  if(e.target.id==='seasonPass')changeContent(content.options.filter(o=>o.group==='season').map(o=>o.id),e.target.checked);
  else if(contentIds.has(e.target.dataset.content))changeContent([e.target.dataset.content],e.target.checked);
 });
}

// Small integration surface: Google/Drive code stays outside Checklist logic.
window.EDF_CHECKLIST_STORAGE={
 get(){mergeLatest();if(storageError)throw Error("本機存檔異常，請先匯出備份並處理儲存問題。");return validate(JSON.parse(JSON.stringify(state))).data;},
 validate,
 reconcile(data){
  data=validate(data).data;mergeLatest();
  if(storageError)throw Error('本機存檔異常，已停止同步，請先匯出備份。');
  const changes=[];
  for(const key of ['entries','favorites','content','missionNotes']){
   state[key]??={};
   for(const [id,e] of Object.entries(data[key]||{})){
    const current=state[key][id];
    // Preserve explicit false values; equal timestamps keep local state.
    if(!current||e.updatedAt>current.updatedAt)changes.push({key,id,value:e});
   }
  }
  if(!changes.length)return;
  if(!saveSnapshot('雲端同步前'))throw Error('無法保留本機快照，已停止同步，請先匯出備份。');
  for(const c of changes)state[c.key][c.id]={...c.value};
  persist();render();
  if(storageError)throw Error('同步進度的本機儲存失敗，請立即匯出備份。');
 },
 apply(data,mode){applyImport(validate(data).data,mode,{requireSnapshot:true});if(storageError)throw Error("雲端進度已套用至畫面，但本機儲存失敗。請立即匯出 JSON 備份。");},
 export:download
};
