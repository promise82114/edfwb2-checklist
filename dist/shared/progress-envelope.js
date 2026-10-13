// Reusable project isolation/versioned envelope, independent of progress schema.
(function(global){
 'use strict';
 function pack(projectId,data){return {schemaVersion:1,updatedAt:new Date(data.updatedAt).toISOString(),projectId,data};}
 function unpack(raw,projectId,validate){
  if(!raw||raw.schemaVersion!==1||raw.projectId!==projectId||typeof raw.updatedAt!=='string'||!Number.isFinite(Date.parse(raw.updatedAt)))throw Error('雲端備份的專案、版本或更新時間不正確，未修改本機進度。');
  return validate(raw.data);
 }
 global.SideProjectProgress={pack,unpack};
})(window);
