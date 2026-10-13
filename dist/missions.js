/* Candidate pools are inferred from Wiki regions/versions, not in-game roll odds. */
window.EDF_MISSIONS = (() => {
  const catalog=window.EDF_CATALOG, details=window.EDF_DETAILS;
  function slot(c){if(c.name==='コロニスト')return 'β';if(c.name==='コスモノーツ')return 'γ';return details.characters[c.name]?.variants.length===1?'α':c.variant;}
  const characters=catalog.items.filter(i=>i.kind==='characters');
  const rows=[];
  for(const extra of [false,true])for(let number=1;number<=(extra?16:104);number++){
    const group=details.groups.find(g=>g.extra===extra&&number>=g.start&&number<=g.end);
    const noRescue=!extra&&details.noRescueMissions.includes(number);
    const candidates=group&&!noRescue?characters.filter(c=>{const meta=details.characters[c.name];return meta&&group.pools[meta.pool]?.includes(slot(c));}):[];
    rows.push({number,extra,code:(extra?'EX':'M')+String(number).padStart(2,'0'),known:!!group||noRescue,noRescue,candidates,
      uncertain:group?.uncertain||[],source:details.distributionSource});
  }
  return {rows,slot};
})();
