const form=document.querySelector("#economics-form"),metrics=document.querySelector("#metrics"),insights=document.querySelector("#insights"),exportBtn=document.querySelector("#export");
let latest=null;
const ids=["period","ad-spend","other-costs","delivery-costs","leads","qualified","appointments","customers","revenue","margin"];
const val=id=>Number(document.querySelector("#"+id).value)||0;
const money=n=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n);
const pct=n=>new Intl.NumberFormat("pt-BR",{style:"percent",maximumFractionDigits:1}).format(n);
const ratio=(a,b)=>b>0?a/b:null;
const show=n=>n===null?"—":money(n);
const card=(label,value,note)=>'<article class="metric"><span>'+label+'</span><strong>'+value+'</strong><small>'+note+'</small></article>';
function calculate(e){if(e)e.preventDefault();if(!form.reportValidity())return;
const d=Object.fromEntries(ids.map(id=>[id,id==="period"?document.querySelector("#period").value:val(id)]));
const errors=[];if(d.qualified>d.leads)errors.push("Leads qualificados não podem superar leads recebidos.");if(d.appointments>d.qualified)errors.push("Agendamentos não podem superar leads qualificados.");if(d.customers>d.appointments)errors.push("Novos clientes não podem superar agendamentos. Se suas etapas não forem sequenciais, ajuste o modelo antes de interpretar.");
if(errors.length){insights.innerHTML='<ul class="notes">'+errors.map(x=>'<li>'+x+'</li>').join("")+'</ul>';return;}
const totalCost=d["ad-spend"]+d["other-costs"],grossProfit=d.revenue*d.margin/100,contribution=grossProfit-d["delivery-costs"]-totalCost;
const m={cpl:ratio(d["ad-spend"],d.leads),cpql:ratio(d["ad-spend"],d.qualified),costAppointment:ratio(d["ad-spend"],d.appointments),mediaCAC:ratio(d["ad-spend"],d.customers),fullCAC:ratio(totalCost,d.customers),roas:ratio(d.revenue,d["ad-spend"]),leadRate:ratio(d.leads,d.leads),qualification:ratio(d.qualified,d.leads),qualifiedToAppointment:ratio(d.appointments,d.qualified),appointmentToCustomer:ratio(d.customers,d.appointments),leadToCustomer:ratio(d.customers,d.leads),grossProfit,contribution,marketingReturn:ratio(contribution,totalCost),breakEvenCAC:grossProfit>0?grossProfit/Math.max(1,d.customers):null};
latest={inputs:d,metrics:m,totalAcquisitionCost:totalCost};
metrics.innerHTML=[
card("CPL de mídia",show(m.cpl),"Investimento em anúncios ÷ leads"),
card("CPQL de mídia",show(m.cpql),"Investimento ÷ leads qualificados"),
card("Custo por agendamento",show(m.costAppointment),"Mídia ÷ agendamentos"),
card("CAC de mídia",show(m.mediaCAC),"Mídia ÷ novos clientes"),
card("CAC incluindo outros custos",show(m.fullCAC),"Aquisição total ÷ novos clientes"),
card("ROAS",m.roas===null?"—":m.roas.toFixed(2)+"x","Receita atribuída ÷ mídia"),
card("Margem bruta estimada",money(grossProfit),"Receita × margem informada"),
card("Contribuição após custos informados",money(contribution),"Margem bruta − entrega − aquisição"),
card("Retorno sobre aquisição",m.marketingReturn===null?"—":pct(m.marketingReturn),"Contribuição ÷ custo total de aquisição"),
card("CAC de equilíbrio estimado",show(m.breakEvenCAC),"Margem bruta por novo cliente")
].join("");
const notes=[];
if(d["ad-spend"]===0)notes.push("Não houve investimento em mídia informado; ROAS e indicadores de custo de mídia não são calculados.");
if(d.customers===0)notes.push("Sem novos clientes registrados, CAC não pode ser calculado. Verifique janela de conversão e ciclo comercial.");
if(m.roas!==null&&m.roas<1)notes.push("ROAS abaixo de 1: a receita atribuída está abaixo do investimento em mídia, antes de considerar outros custos.");
if(contribution<0)notes.push("A contribuição estimada está negativa após os custos informados. Investigue margem, atribuição, ticket, conversão e custos antes de decidir cortes.");
else notes.push("A contribuição estimada é positiva após os custos informados; confirme se todos os custos relevantes e reembolsos estão incluídos.");
if(d.qualified===0&&d.leads>0)notes.push("Há leads, mas nenhum qualificado informado. Revise critérios de qualificação, origem e qualidade.");
if(d.appointments===0&&d.qualified>0)notes.push("Há leads qualificados sem agendamentos informados. Investigue velocidade de contato, disponibilidade e abordagem comercial.");
if(d.customers>0&&d.appointments>0)notes.push("Taxa de conversão de agendamento para cliente: "+pct(m.appointmentToCustomer)+". Compare por serviço, origem e período.");
notes.push("CAC de equilíbrio considera somente a margem bruta informada por cliente e os custos de aquisição incluídos. Não equivale ao ponto de equilíbrio completo da empresa.");
notes.push("Os resultados dependem da qualidade da atribuição e da maturação da coorte. Não compare períodos com janelas comerciais diferentes.");
insights.innerHTML='<ul class="notes">'+notes.map(x=>'<li>'+x+'</li>').join("")+'</ul>';exportBtn.disabled=false;
}
form.addEventListener("submit",calculate);
exportBtn.addEventListener("click",()=>{if(!latest)return;const rows=[];for(const [k,v] of Object.entries(latest.inputs))rows.push([k,v]);for(const [k,v] of Object.entries(latest.metrics))rows.push([k,v===null?"":v]);rows.push(["total_acquisition_cost",latest.totalAcquisitionCost]);const csv="\uFEFFcampo;valor\r\n"+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(";")).join("\r\n");const a=document.createElement("a"),url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.href=url;a.download="ekoads-diagnostico-economico.csv";a.click();URL.revokeObjectURL(url);});
