const input = document.querySelector("#csv-file");
const statusEl = document.querySelector("#status");
const summaryEl = document.querySelector("#summary");
const queueEl = document.querySelector("#queue");
const recEl = document.querySelector("#recommendations");
const downloadBtn = document.querySelector("#download");
let analyzedRows = [];
let sourceName = "relatorio";

const norm = s => String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
function csvParse(text) {
  const first = text.split(/\r?\n/,1)[0] || "";
  const delimiter = [",",";","\t"].map(d=>({d,n:first.split(d).length})).sort((a,b)=>b.n-a.n)[0].d;
  const rows=[]; let row=[], cell="", quoted=false;
  for(let i=0;i<text.length;i++){
    const c=text[i], next=text[i+1];
    if(c==='"' && quoted && next==='"'){cell+='"';i++;}
    else if(c==='"') quoted=!quoted;
    else if(c===delimiter && !quoted){row.push(cell);cell="";}
    else if((c==="\n"||c==="\r")&&!quoted){if(c==="\r"&&next==="\n")i++;row.push(cell);cell="";if(row.some(v=>v.trim()))rows.push(row);row=[];}
    else cell+=c;
  }
  row.push(cell);if(row.some(v=>v.trim()))rows.push(row);return rows;
}
function num(v){
  let s=String(v??"").trim().replace(/[R$€£\s%]/g,"").replace(/[^0-9,.-]/g,"");
  if(!s||s==="-")return 0;
  const c=s.lastIndexOf(","),d=s.lastIndexOf(".");
  if(c>d)s=s.replace(/\./g,"").replace(",",".");
  else if(d>c&&c!==-1)s=s.replace(/,/g,"");
  else if(c!==-1&&d===-1)s=s.replace(",",".");
  const n=Number(s);return Number.isFinite(n)?n:0;
}
function col(headers, aliases){const h=headers.map(norm);for(const a of aliases){const i=h.indexOf(norm(a));if(i>=0)return i;}return -1;}
const brl=v=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v);
const safe=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const card=(a,b,c)=>`<article class="metric"><span>${a}</span><strong>${b}</strong><small>${c}</small></article>`;
function analyze(){
 if(!analyzedRows.length)return;
 const minClicks=Math.max(1,Number(document.querySelector("#min-clicks").value)||10);
 const minCost=Math.max(0,Number(document.querySelector("#min-cost").value)||0);
 const targetCPA=Number(document.querySelector("#target-cpa").value)||0;
 const rows=analyzedRows.map(r=>{
   const reasons=[];
   if(r.cost>=minCost&&r.clicks>=minClicks&&r.conversions===0)reasons.push("Custo e cliques acima dos limites, sem conversão reportada");
   if(targetCPA>0&&r.conversions>0&&r.cost/r.conversions>targetCPA)reasons.push("CPA acima da referência informada");
   const priority=reasons.length?(r.conversions===0?"Alta":"Média"):"Monitorar";
   return {...r,reasons,priority};
 });
 const total=rows.reduce((a,r)=>({clicks:a.clicks+r.clicks,cost:a.cost+r.cost,conversions:a.conversions+r.conversions,impressions:a.impressions+r.impressions}),{clicks:0,cost:0,conversions:0,impressions:0});
 const flagged=rows.filter(r=>r.reasons.length).sort((a,b)=>b.cost-a.cost);
 summaryEl.innerHTML=[
  card("Linhas analisadas",rows.length,"Registros importados"),
  card("Investimento",brl(total.cost),"Soma do custo"),
  card("Conversões",total.conversions.toLocaleString("pt-BR"),"Conversões reportadas"),
  card("CPA geral",total.conversions?brl(total.cost/total.conversions):"—","Custo ÷ conversões"),
  card("Linhas para investigar",flagged.length,"Regras acionadas"),
  card("Custo nas linhas sinalizadas",brl(flagged.reduce((a,r)=>a+r.cost,0)),"Não representa perda comprovada")
 ].join("");
 queueEl.innerHTML=flagged.length?flagged.map(r=>`<tr><td>${safe(r.term)}</td><td><strong>${r.priority}</strong></td><td>${r.clicks}</td><td>${brl(r.cost)}</td><td>${r.conversions}</td><td>${safe(r.reasons.join("; "))}. Verificar intenção, janela de conversão e qualidade comercial.</td></tr>`).join(""):'<tr><td colspan="6">Nenhuma linha ultrapassou os limites atuais.</td></tr>';
 const recommendations=[];
 if(flagged.length)recommendations.push(`Revisar ${flagged.length} linha(s) sinalizada(s), começando pelas de maior custo. Não negativar sem conferir contexto e termos semelhantes.`);
 if(total.conversions===0)recommendations.push("O relatório não registra conversões. Antes de otimizar por CPA, validar configuração, disparo, deduplicação e atraso das conversões.");
 else recommendations.push("Validar se as conversões reportadas correspondem a leads recebidos e qualificados, agendamentos ou vendas.");
 if(!targetCPA)recommendations.push("Definir CPA de referência com base em margem, taxa de fechamento, ticket e capacidade operacional para habilitar comparação econômica.");
 recommendations.push("Separar termos por intenção e serviço antes de comparar desempenho ou redistribuir orçamento.");
 recEl.innerHTML=`<ul class="notes">${recommendations.map(x=>`<li>${safe(x)}</li>`).join("")}</ul>`;
 analyzedRows=rows;
 downloadBtn.disabled=false;
}
input.addEventListener("change",async()=>{
 const file=input.files?.[0];if(!file)return;
 sourceName=file.name.replace(/\.csv$/i,"")||"relatorio";
 if(file.size>5*1024*1024){statusEl.textContent="Arquivo acima de 5 MB. Exporte um período menor.";return;}
 try{
  const table=csvParse((await file.text()).replace(/^\uFEFF/,""));
  if(table.length<2)throw Error("CSV sem linhas de dados.");
  const h=table[0];
  const ti=col(h,["Termo de pesquisa","Search term","Palavra-chave","Keyword"]);
  const ii=col(h,["Impressões","Impr.","Impressions"]);
  const ci=col(h,["Cliques","Clicks"]);
  const co=col(h,["Custo","Cost"]);
  const vi=col(h,["Conversões","Conv.","Conversions"]);
  if(ci<0||co<0)throw Error("Colunas obrigatórias Cliques e Custo não encontradas.");
  analyzedRows=table.slice(1).map(row=>({term:ti>=0?(row[ti]||"(sem termo)").trim():"(termo não disponível)",impressions:ii>=0?num(row[ii]):0,clicks:num(row[ci]),cost:num(row[co]),conversions:vi>=0?num(row[vi]):0})).filter(r=>r.clicks||r.cost||r.impressions||r.conversions);
  if(!analyzedRows.length)throw Error("Nenhuma linha com métricas foi encontrada.");
  statusEl.textContent=`Arquivo ${file.name}: ${analyzedRows.length} linhas lidas.`;
  analyze();
 }catch(e){statusEl.textContent=e.message;analyzedRows=[];downloadBtn.disabled=true;}
});
document.querySelector("#reanalyze").addEventListener("click",analyze);
downloadBtn.addEventListener("click",()=>{
 const header=["Termo","Cliques","Custo","Conversoes","Prioridade","Motivos"];
 const lines=[header,...analyzedRows.map(r=>[r.term,r.clicks,r.cost,r.conversions,r.priority,r.reasons.join(" | ")])];
 const csv=lines.map(row=>row.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(";")).join("\r\n");
 const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"});
 const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=sourceName+"-analise-ekoads.csv";a.click();URL.revokeObjectURL(url);
});
