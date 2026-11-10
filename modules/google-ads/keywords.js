const fileInput=document.querySelector("#csv-file"),statusEl=document.querySelector("#status");
const summaryEl=document.querySelector("#summary"),resultsEl=document.querySelector("#results"),negEl=document.querySelector("#negatives");
const downloadBtn=document.querySelector("#download"),negativeBtn=document.querySelector("#download-negatives");
let sourceRows=[],classified=[],negativeRows=[];
const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const safe=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const brl=n=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n);
function parseCSV(text){
 const first=text.split(/\r?\n/,1)[0]||"",delim=[",",";","\t"].map(d=>({d,n:first.split(d).length})).sort((a,b)=>b.n-a.n)[0].d;
 const out=[];let row=[],cell="",q=false;
 for(let i=0;i<text.length;i++){const c=text[i],next=text[i+1];if(c==='"'&&q&&next==='"'){cell+='"';i++;}else if(c==='"')q=!q;else if(c===delim&&!q){row.push(cell);cell="";}else if((c==="\n"||c==="\r")&&!q){if(c==="\r"&&next==="\n")i++;row.push(cell);if(row.some(x=>x.trim()))out.push(row);row=[];cell="";}else cell+=c;}
 row.push(cell);if(row.some(x=>x.trim()))out.push(row);return out;
}
function number(v){let s=String(v??"").trim().replace(/[R$€£\s%]/g,"").replace(/[^0-9,.-]/g,"");if(!s||s==="-")return 0;const c=s.lastIndexOf(","),d=s.lastIndexOf(".");if(c>d)s=s.replace(/\./g,"").replace(",",".");else if(d>c&&c!==-1)s=s.replace(/,/g,"");else if(c!==-1&&d===-1)s=s.replace(",",".");const n=Number(s);return Number.isFinite(n)?n:0;}
function findCol(headers,aliases){const h=headers.map(norm);for(const a of aliases){const i=h.indexOf(norm(a));if(i>=0)return i;}return -1;}
function terms(id){return document.querySelector("#"+id).value.split(/\r?\n/).map(norm).filter(Boolean);}
function classify(term){
 const t=norm(term),sets=[["Marca",terms("brand")],["Transacional",terms("transactional")],["Comercial",terms("commercial")],["Informacional",terms("informational")]];
 for(const [name,words] of sets){if(words.some(w=>t.includes(w)))return name;}
 return "Ambígua";
}
function csvCell(v){return '"'+String(v??"").replace(/"/g,'""')+'"';}
function download(name,rows,headers){const csv="\uFEFF"+[headers,...rows.map(r=>headers.map(h=>r[h]??""))].map(r=>r.map(csvCell).join(";")).join("\r\n");const a=document.createElement("a"),url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.href=url;a.download=name+".csv";a.click();URL.revokeObjectURL(url);}
function analyze(){
 if(!sourceRows.length)return;
 classified=sourceRows.map(r=>({...r,intent:classify(r.term)}));
 const groups=["Transacional","Comercial","Informacional","Marca","Ambígua"];
 summaryEl.innerHTML=groups.map(g=>{const rows=classified.filter(r=>r.intent===g);return '<article class="metric"><span>'+g+'</span><strong>'+rows.length+'</strong><small>'+brl(rows.reduce((s,r)=>s+r.cost,0))+' em custo</small></article>';}).join("");
 resultsEl.innerHTML=classified.map(r=>{const advice={Transacional:"Avaliar aderência ao serviço e potencial de conversão.",Comercial:"Considerar grupo de anúncios e mensagem próprios.",Informacional:"Avaliar conteúdo, campanha e exclusão conforme objetivo.",Marca:"Verificar estratégia e proteção de marca.",Ambígua:"Revisar manualmente o contexto da busca."}[r.intent];return '<tr><td>'+safe(r.term)+'</td><td><strong>'+r.intent+'</strong></td><td>'+r.clicks+'</td><td>'+brl(r.cost)+'</td><td>'+r.conversions+'</td><td>'+advice+'</td></tr>';}).join("");
 negativeRows=classified.filter(r=>r.intent==="Informacional"||(r.clicks>=10&&r.cost>0&&r.conversions===0));
 negEl.innerHTML=negativeRows.length?'<div class="table-wrap"><table><thead><tr><th>Candidato</th><th>Motivo</th><th>Cliques</th><th>Custo</th></tr></thead><tbody>'+negativeRows.map(r=>'<tr><td>'+safe(r.term)+'</td><td>'+(r.intent==="Informacional"?"Classificado como informacional":"10+ cliques, custo e zero conversões reportadas")+'</td><td>'+r.clicks+'</td><td>'+brl(r.cost)+'</td></tr>').join("")+'</tbody></table></div>':'<p class="empty">Nenhum candidato identificado pelas regras atuais.</p>';
 downloadBtn.disabled=negativeBtn.disabled=false;
}
fileInput.addEventListener("change",async()=>{const f=fileInput.files?.[0];if(!f)return;if(f.size>5*1024*1024){statusEl.textContent="Arquivo acima de 5 MB. Exporte um período menor.";return;}try{const table=parseCSV((await f.text()).replace(/^\uFEFF/,""));if(table.length<2)throw Error("CSV sem linhas de dados.");const h=table[0],ti=findCol(h,["Termo de pesquisa","Search term","Palavra-chave","Keyword"]),ci=findCol(h,["Cliques","Clicks"]),co=findCol(h,["Custo","Cost"]),vi=findCol(h,["Conversões","Conv.","Conversions"]);if(ti<0)throw Error("Não encontrei a coluna Termo de pesquisa ou Palavra-chave.");sourceRows=table.slice(1).map(row=>({term:(row[ti]||"").trim(),clicks:ci<0?0:number(row[ci]),cost:co<0?0:number(row[co]),conversions:vi<0?0:number(row[vi])})).filter(r=>r.term);if(!sourceRows.length)throw Error("Nenhum termo válido encontrado.");statusEl.textContent=sourceRows.length+" termos carregados de "+f.name+". Cliques/custo/conversões ausentes foram tratados como zero; isso não significa ausência real de atividade.";analyze();}catch(e){sourceRows=[];statusEl.textContent="Erro: "+e.message;}});
document.querySelector("#reanalyze").addEventListener("click",analyze);
downloadBtn.addEventListener("click",()=>download("ekoads-keyword-intelligence",classified,["term","intent","clicks","cost","conversions"]));
negativeBtn.addEventListener("click",()=>download("ekoads-candidatos-negativas",negativeRows,["term","intent","clicks","cost","conversions"]));
