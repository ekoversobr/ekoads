(()=>{"use strict";
const $=s=>document.querySelector(s),ids=["spend","impressions","clicks","other-costs","margin","leads","qualified","appointments","attended","customers","revenue"];
let sourceRows=[],latest=null;
const num=id=>Number($("#"+id).value)||0,money=n=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n),pct=n=>new Intl.NumberFormat("pt-BR",{style:"percent",maximumFractionDigits:1}).format(n),ratio=(a,b)=>b?a/b:null;
const card=(a,b,c)=>'<article class="metric"><span>'+a+'</span><strong>'+b+'</strong><small>'+c+'</small></article>';
function render(){
 const d=Object.fromEntries(ids.map(k=>[k,num(k)]));
 const calculated=EkoAdsDashboard.calculate({spend:d.spend,otherCosts:d["other-costs"],margin:d.margin,revenue:d.revenue,impressions:d.impressions,clicks:d.clicks,leads:d.leads,qualified:d.qualified,appointments:d.appointments,attended:d.attended,customers:d.customers});
 if(!calculated.valid){$("#insights").innerHTML=calculated.errors.map(x=>"<p>⚠ "+x+"</p>").join("");return;}
 const {ctr,cpc,cpl,cpql,costPerAppointment:cpa,cac,roas,grossProfit:gross,contribution}=calculated.metrics;
 latest={context:{client:$("#client").value,period:$("#period").value},inputs:d,metrics:{ctr,cpc,cpl,cpql,cpa,cac,roas,gross,contribution}};
 $("#metrics").innerHTML=[
 card("Investimento em mídia",money(d.spend),"Período informado"),
 card("CTR",ctr===null?"—":pct(ctr),"Cliques ÷ impressões"),
 card("CPC médio",cpc===null?"—":money(cpc),"Mídia ÷ cliques"),
 card("CPL",cpl===null?"—":money(cpl),"Mídia ÷ leads recebidos"),
 card("CPQL",cpql===null?"—":money(cpql),"Mídia ÷ leads qualificados"),
 card("Custo por agendamento",cpa===null?"—":money(cpa),"Mídia ÷ agendamentos"),
 card("CAC de aquisição",cac===null?"—":money(cac),"Mídia + outros custos ÷ vendas"),
 card("ROAS",roas===null?"—":roas.toFixed(2)+"x","Receita ÷ mídia"),
 card("Contribuição estimada",money(contribution),"Margem bruta estimada menos aquisição")
 ].join("");
 const funnel=[["Recebidos",d.leads],["Qualificados",d.qualified],["Agendados",d.appointments],["Compareceram",d.attended],["Vendas",d.customers]];
 $("#funnel").innerHTML=funnel.map((x,i)=>card(x[0],x[1].toLocaleString("pt-BR"),i&&funnel[i-1][1]?pct(x[1]/funnel[i-1][1])+" da etapa anterior":"Base do funil")).join("");
 const notes=[];
 if(d.spend>0&&d.leads===0)notes.push("Há investimento sem leads registrados: conferir período, formulário, WhatsApp e rastreamento.");
 if(d.leads>0&&d.qualified===0)notes.push("Nenhum lead qualificado informado: revisar critérios de qualificação e qualidade por origem.");
 if(d.qualified>0&&d.appointments===0)notes.push("Há leads qualificados sem agendamentos: investigar velocidade de resposta, disponibilidade e abordagem.");
 if(d.customers===0)notes.push("Sem vendas registradas: CAC não calculável. Verificar maturação do ciclo comercial.");
 if(roas!==null&&roas<1)notes.push("ROAS abaixo de 1: receita atribuída abaixo do investimento em mídia, antes de outros custos.");
 if(contribution<0)notes.push("Contribuição estimada negativa após os custos informados. Validar atribuição, margem e custos antes de alterar orçamento.");
 if(!notes.length)notes.push("Sem alertas aritméticos identificados. Confirme atribuição, maturação das conversões e conciliação financeira antes de tomar decisões.");
 notes.push("A contribuição usa a margem bruta estimada informada e subtrai mídia e outros custos de aquisição. Não equivale a lucro líquido.");
 notes.push("As métricas de mídia são agregadas; a tabela por origem mostra apenas os registros comerciais importados. Não atribua investimento por origem sem dados de custo segmentados.");
 $("#insights").innerHTML=notes.map(x=>"<p>"+x+"</p>").join("");
 renderSources();
}
function renderSources(){
 const stageRank={received:0,qualified:1,scheduled:2,attended:3,won:4};
 const groups={};for(const r of sourceRows){groups[r.source]??={source:r.source,values:[0,0,0,0,0],revenue:0};const rank=stageRank[r.stage];if(rank!==undefined)groups[r.source].values.forEach((_,i)=>{if(rank>=i)groups[r.source].values[i]++});if(r.stage==="won")groups[r.source].revenue+=r.value;}
 const rows=Object.values(groups);
 $("#sources").innerHTML=rows.length?rows.map(g=>'<tr><td>'+esc(g.source)+'</td>'+g.values.map(v=>'<td>'+v+'</td>').join("")+'<td>'+money(g.revenue)+'</td></tr>').join(""):'<tr><td colspan="7">Importe CSV para ver a origem.</td></tr>';
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function parse(text){const first=text.split(/\r?\n/,1)[0]||"",del=[",",";","\t"].map(x=>({x,n:first.split(x).length})).sort((a,b)=>b.n-a.n)[0].x,out=[];let row=[],cell="",q=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&q&&n==='"'){cell+='"';i++}else if(c==='"')q=!q;else if(c===del&&!q){row.push(cell);cell=""}else if((c==="\n"||c==="\r")&&!q){if(c==="\r"&&n==="\n")i++;row.push(cell);if(row.some(v=>v.trim()))out.push(row);row=[];cell=""}else cell+=c}row.push(cell);if(row.some(v=>v.trim()))out.push(row);return out}
$("#csv").addEventListener("change",async e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>5*1024*1024){$("#status").textContent="CSV acima de 5 MB.";return}try{const rows=parse((await f.text()).replace(/^\uFEFF/,""));const h=rows.shift().map(x=>x.trim().toLowerCase()),idx=k=>h.indexOf(k);for(const k of ["ref","source","channel","stage","value","date"])if(idx(k)<0)throw Error("Coluna ausente: "+k);sourceRows=rows.map(r=>({source:r[idx("source")],stage:r[idx("stage")],value:Number(String(r[idx("value")]).replace(",","."))||0})).filter(r=>r.source&&["received","qualified","scheduled","attended","won","lost"].includes(r.stage));const rank={received:0,qualified:1,scheduled:2,attended:3,won:4};const count=[0,0,0,0,0];for(const r of sourceRows){const n=rank[r.stage];if(n!==undefined)for(let i=0;i<=n;i++)count[i]++;}$("#leads").value=count[0];$("#qualified").value=count[1];$("#appointments").value=count[2];$("#attended").value=count[3];$("#customers").value=count[4];$("#revenue").value=sourceRows.filter(x=>x.stage==="won").reduce((s,x)=>s+x.value,0).toFixed(2);$("#status").textContent=sourceRows.length+" registros agregados por origem. As contagens são estados atuais, não coortes.";render();}catch(err){$("#status").textContent="Falha na importação: "+err.message;}e.target.value=""});
$("#calculate").addEventListener("click",render);ids.forEach(id=>$("#"+id).addEventListener("change",render));
$("#export").addEventListener("click",()=>{if(!latest)return;const rows=[];for(const [k,v] of Object.entries(latest.context))rows.push([k,v]);for(const [k,v] of Object.entries(latest.inputs))rows.push([k,v]);for(const [k,v] of Object.entries(latest.metrics))rows.push([k,v??""]);const csv="\uFEFFcampo;valor\r\n"+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(";")).join("\r\n"),a=document.createElement("a"),u=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.href=u;a.download="ekoads-dashboard-resumo.csv";a.click();URL.revokeObjectURL(u)});
render();
})();