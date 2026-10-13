import fs from 'node:fs';
const source=fs.readFileSync('dist/data.js','utf8');
const data=JSON.parse(source.slice('window.EDF_CATALOG = '.length).trim().replace(/;$/,''));
const seen=new Set();
data.items=data.items.filter(i=>{if(seen.has(i.id))return false;seen.add(i.id);return true;});
fs.writeFileSync('dist/data.js','window.EDF_CATALOG = '+JSON.stringify(data,null,2)+';\n');
console.log('Normalized '+data.items.length+' unique items.');
