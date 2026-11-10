(function(root,factory){
 const api=factory();
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
 root.EkoAdsCSV=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 function parseCSV(input){
  const text=String(input??"").replace(/^\\uFEFF/,"");
  const first=text.split(/\\r?\\n/,1)[0]||"";
  const candidates=[",",";","\\t"];
  const delimiter=candidates.map(char=>{let count=0,quoted=false;for(let i=0;i<first.length;i++){if(first[i]==='"'&&first[i+1]==='"'&&quoted){i++;continue;}if(first[i]==='"')quoted=!quoted;else if(first[i]===char&&!quoted)count++;}return{char,count};}).sort((a,b)=>b.count-a.count)[0].char;
  const rows=[];let row=[],cell="",quoted=false;
  for(let i=0;i<text.length;i++){
   const ch=text[i],next=text[i+1];
   if(ch==='"'&&quoted&&next==='"'){cell+='"';i++;}
   else if(ch==='"')quoted=!quoted;
   else if(ch===delimiter&&!quoted){row.push(cell);cell="";}
   else if((ch==="\\n"||ch==="\\r")&&!quoted){if(ch==="\\r"&&next==="\\n")i++;row.push(cell);if(row.some(v=>v.trim()!==""))rows.push(row);row=[];cell="";}
   else cell+=ch;
  }
  if(quoted)throw new Error("CSV contém campo com aspas não fechadas.");
  row.push(cell);if(row.some(v=>v.trim()!==""))rows.push(row);
  return rows;
 }
 function parseNumber(value){
  let s=String(value??"").trim().replace(/[R$€£\\s%]/g,"").replace(/[^0-9,.-]/g,"");
  if(!s||s==="-")return 0;
  const comma=s.lastIndexOf(","),dot=s.lastIndexOf(".");
  if(comma>dot)s=s.replace(/\\./g,"").replace(",",".");
  else if(dot>comma&&comma!==-1)s=s.replace(/,/g,"");
  else if(comma!==-1&&dot===-1)s=s.replace(",",".");
  const n=Number(s);
  if(!Number.isFinite(n))throw new Error("Valor numérico inválido: "+value);
  return n;
 }
 return{parseCSV,parseNumber};
});
