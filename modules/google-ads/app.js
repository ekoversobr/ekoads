const form = document.querySelector("#metrics-form");
const results = document.querySelector("#results-grid");
const brl = value => new Intl.NumberFormat("pt-BR", {style:"currency",currency:"BRL",maximumFractionDigits:2}).format(value);
const pct = value => new Intl.NumberFormat("pt-BR",{maximumFractionDigits:2}).format(value*100)+"%";
const show = (value, formatter) => value === null ? "—" : formatter(value);
function card(title,value,explanation){return `<article class="metric"><span>${title}</span><strong>${value}</strong><small>${explanation}</small></article>`;}

form.addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(["impressions","clicks","spend","leads","qualified","appointments","customers","revenue"].map(name=>[name,Number(form.elements[name].value||0)]));
  const result = EkoAdsMetrics.calculate(data);
  if(!result.valid){results.innerHTML=`<p class="empty" role="alert">${result.errors[0]}</p>`;return;}
  const m=result.metrics;
  const metrics=[
    ["CTR",show(m.ctr,pct),"Cliques ÷ impressões."],
    ["CPC médio",show(m.cpc,brl),"Investimento ÷ cliques."],
    ["CPL",show(m.cpl,brl),"Investimento ÷ leads recebidos."],
    ["CPQL",show(m.cpql,brl),"Investimento ÷ leads qualificados."],
    ["Custo por agendamento",show(m.costPerAppointment,brl),"Investimento ÷ agendamentos."],
    ["CAC de mídia",show(m.mediaCAC,brl),"Investimento em mídia ÷ novos clientes."],
    ["ROAS",show(m.roas,v=>v.toFixed(2)+"x"),"Receita atribuída ÷ investimento."],
    ["Clique → lead",show(m.clickToLead,pct),"Leads recebidos ÷ cliques."],
    ["Taxa de qualificação",show(m.qualificationRate,pct),"Leads qualificados ÷ leads recebidos."],
    ["Qualificado → agendamento",show(m.qualifiedToAppointment,pct),"Agendamentos ÷ leads qualificados."],
    ["Lead → cliente",show(m.leadToCustomer,pct),"Novos clientes ÷ leads recebidos."]
  ];
  results.innerHTML=metrics.map(([title,value,note])=>card(title,value,note)).join("");
});
form.addEventListener("reset",()=>{results.innerHTML='<p class="empty">Preencha os dados e clique em “Calcular indicadores”.</p>';});
