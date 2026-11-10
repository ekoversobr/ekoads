(()=>{"use strict";
const KEY="ekoads_lead_operations_v1",stages={received:"Lead recebido",qualified:"Qualificado",scheduled:"Agendado",attended:"Compareceu",won:"Venda",lost:"Perdido"};
const $=s=>document.querySelector(s),money=n=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n);
let data=load();
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(x)?x:[]}catch{return[]}}
function persist(){localStorage.setItem(KEY,JSON.stringify(data));render()}
const cleanRef=EkoLeadOps.cleanRef,valid=EkoLeadOps.valid;
function escape(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){
 const counts=Object.fromEntries(Object.keys(stages).map(k=>[k,data.filter(x=>x.stage===k).length]));
 const total=data.length,won=data.filter(x=>x.stage==="won"),revenue=won.reduce((s,x)=>s+x.value,0);
 $("#summary").innerHTML=[["Registros",total],["Qualificados",counts.qualified],["Agendamentos",counts.scheduled],["Vendas",counts.won],["Receita conciliada",money(revenue)],["Perdidos",counts.lost]].map(x=>'<article class="metric"><span>'+x[0]+'</span><strong>'+x[1]+'</strong><small>estado atual</small></article>').join("");
 $("#funnel").innerHTML='<p><strong>Distribuição por etapa atual</strong></p>'+Object.entries(stages).map(([k,label])=>'<p>'+label+': '+counts[k]+' ('+(total?pct(counts[k]/total):"0%")+')</p>').join("");
 const fs=$("#filter-source").value,ft=$("#filter-stage").value;
 const filtered=data.filter(x=>(!fs||x.source===fs)&&(!ft||x.stage===ft)).sort((a,b)=>b.date.localeCompare(a.date));
 $("#records").innerHTML=filtered.length?filtered.map(x=>'<tr><td>'+escape(x.ref)+'</td><td>'+escape(x.source)+'</td><td>'+escape(x.channel)+'</td><td>'+stages[x.stage]+'</td><td>'+money(x.value)+'</td><td>'+x.date+'</td><td><button type="button" class="secondary" data-delete="'+escape(x.ref)+'">Excluir</button></td></tr>').join(""):'<tr><td colspan="7">Nenhum registro para este filtro.</td></tr>';
}
function pct(n){return new Intl.NumberFormat("pt-BR",{style:"percent",maximumFractionDigits:1}).format(n)}
$("#date").value=EkoLeadOps.localDate();
$("#lead-form").addEventListener("submit",e=>{e.preventDefault();const r={ref:cleanRef($("#lead-ref").value),source:$("#source").value,channel:$("#channel").value,stage:$("#stage").value,value:Number($("#value").value),date:$("#date").value};if(!valid(r)){ $("#form-status").textContent="Confira a referência, etapa, valor e data.";return;}const i=data.findIndex(x=>x.ref===r.ref);if(i>=0)data[i]=r;else data.push(r);persist();$("#form-status").textContent=i>=0?"Registro atualizado.":"Registro salvo localmente.";$("#lead-ref").value="";$("#value").value="0";});
$("#records").addEventListener("click",e=>{const b=e.target.closest("[data-delete]");if(!b)return;data=data.filter(x=>x.ref!==b.dataset.delete);persist()});
$("#filter-source").addEventListener("change",render);$("#filter-stage").addEventListener("change",render);
function csvCell(v){return '"'+String(v??"").replace(/"/g,'""')+'"'}
function download(rows,name){const heads=["ref","source","channel","stage","value","date"],csv="\uFEFF"+[heads,...rows.map(x=>heads.map(h=>x[h]))].map(r=>r.map(csvCell).join(";")).join("\r\n"),a=document.createElement("a"),u=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.href=u;a.download=name+".csv";a.click();URL.revokeObjectURL(u)}
$("#export").addEventListener("click",()=>download(data,"ekoads-leads-operacionais"));
$("#import").addEventListener("change",async e=>{
 const f=e.target.files?.[0];if(!f)return;
 if(f.size>2*1024*1024){alert("Arquivo acima de 2 MB.");e.target.value="";return;}
 try{
  const result=EkoLeadOps.importRows(await f.text(),data);
  data=result.records;persist();
  alert(result.added+" novos, "+result.updated+" atualizados, "+result.skipped+" ignorados.");
 }catch(err){alert("Falha na importação: "+err.message)}
 e.target.value="";
});
$("#clear").addEventListener("click",()=>{if(confirm("Apagar permanentemente todos os registros deste navegador?")){data=[];persist();$("#form-status").textContent="Dados locais apagados."}});
render();
})();