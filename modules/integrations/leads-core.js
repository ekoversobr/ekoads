(function(root,factory){
 const api=factory();
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
 root.EkoLeadOps=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 const stages=["received","qualified","scheduled","attended","won","lost"];
 function cleanRef(s){return String(s||"").trim().replace(/[^a-zA-Z0-9_-]/g,"").slice(0,40);}
 function valid(r){
  if(!r||!r.ref||r.ref.length<4||!stages.includes(r.stage))return false;
  if(typeof r.source!=="string"||!r.source.trim()||typeof r.channel!=="string"||!r.channel.trim())return false;
  if(!Number.isFinite(Number(r.value))||Number(r.value)<0||!/^\d{4}-\d{2}-\d{2}$/.test(r.date||""))return false;
  const [y,m,d]=r.date.split("-").map(Number),dt=new Date(Date.UTC(y,m-1,d));
  return dt.getUTCFullYear()===y&&dt.getUTCMonth()===m-1&&dt.getUTCDate()===d;
 }
 function parseNumber(value){
  const raw=String(value??"").trim();if(!raw||raw==="-")return 0;
  let s=raw.replace(/[R$€£\s]/g,"").replace(/[^0-9,.-]/g,"");
  if(!s)throw Error("Valor numérico inválido: "+value);
  const c=s.lastIndexOf(","),p=s.lastIndexOf(".");
  if(c>p)s=s.replace(/\./g,"").replace(",",".");else if(p>c&&c!==-1)s=s.replace(/,/g,"");else if(c!==-1&&p===-1)s=s.replace(",",".");
  const n=Number(s);if(!Number.isFinite(n))throw Error("Valor numérico inválido: "+value);return n;
 }
 function parseCSV(input){
  const text=String(input??"").replace(/^\uFEFF/,""),first=text.split(/\r?\n/,1)[0]||"";
  const delim=[",",";","\t"].map(x=>({x,n:first.split(x).length})).sort((a,b)=>b.n-a.n)[0].x;
  const rows=[];let row=[],cell="",q=false;
  for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&q&&n==='"'){cell+='"';i++;}else if(c==='"')q=!q;else if(c===delim&&!q){row.push(cell);cell="";}else if((c==="\r"||c==="\n")&&!q){if(c==="\r"&&n==="\n")i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell="";}else cell+=c;}
  if(q)throw Error("CSV contém aspas não fechadas.");row.push(cell);if(row.some(v=>v.trim()))rows.push(row);return rows;
 }
 function importRows(text,existing=[]){
  const rows=parseCSV(text);if(!rows.length)throw Error("CSV vazio.");
  const headers=rows.shift().map(x=>x.trim().toLowerCase()),required=["ref","source","channel","stage","value","date"],ix=k=>headers.indexOf(k);
  for(const k of required)if(ix(k)<0)throw Error("Coluna obrigatória ausente: "+k);
  const next=existing.map(x=>({...x}));let added=0,updated=0,skipped=0;
  for(const row of rows){if(row.length!==headers.length){skipped++;continue;}
   let r;try{r={ref:cleanRef(row[ix("ref")]),source:row[ix("source")].trim(),channel:row[ix("channel")].trim(),stage:row[ix("stage")].trim(),value:parseNumber(row[ix("value")]),date:row[ix("date")].trim()};}catch{skipped++;continue;}
   if(!valid(r)){skipped++;continue;}const at=next.findIndex(x=>x.ref===r.ref);if(at>=0){next[at]=r;updated++;}else{next.push(r);added++;}
  }
  return{records:next,added,updated,skipped};
 }
 function summarize(records){const counts=Object.fromEntries(stages.map(s=>[s,0]));let revenue=0;for(const r of records){if(counts[r.stage]!==undefined)counts[r.stage]++;if(r.stage==="won")revenue+=Number(r.value)||0;}return{counts,total:records.length,revenue};}
 return{stages,cleanRef,valid,parseNumber,parseCSV,importRows,summarize};
});