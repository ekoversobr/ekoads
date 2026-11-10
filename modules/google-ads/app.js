const form = document.querySelector("#metrics-form");
const results = document.querySelector("#results-grid");

const number = (name) => Number(form.elements[name].value || 0);
const brl = (value) => new Intl.NumberFormat("pt-BR", {
  style: "currency", currency: "BRL", maximumFractionDigits: 2
}).format(value);
const pct = (value) => new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2
}).format(value) + "%";
const ratio = (numerator, denominator, formatter = (v) => v.toFixed(2)) =>
  denominator > 0 ? formatter(numerator / denominator) : "—";

function card(title, value, explanation) {
  return `<article class="metric"><span>${title}</span><strong>${value}</strong><small>${explanation}</small></article>`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const impressions = number("impressions");
  const clicks = number("clicks");
  const spend = number("spend");
  const leads = number("leads");
  const qualified = number("qualified");
  const appointments = number("appointments");
  const customers = number("customers");
  const revenue = number("revenue");

  const invalid = [
    [clicks, impressions, "Cliques não podem superar impressões."],
    [qualified, leads, "Leads qualificados não podem superar leads recebidos."],
    [appointments, qualified, "Agendamentos não podem superar leads qualificados."],
    [customers, leads, "Novos clientes não podem superar leads recebidos."]
  ].find(([value, base]) => value > base);

  if (invalid) {
    results.innerHTML = `<p class="empty" role="alert">${invalid[2]}</p>`;
    return;
  }

  const metrics = [
    ["CTR", ratio(clicks * 100, impressions, pct), "Cliques ÷ impressões."],
    ["CPC médio", ratio(spend, clicks, brl), "Investimento ÷ cliques."],
    ["CPL", ratio(spend, leads, brl), "Investimento ÷ leads recebidos."],
    ["CPQL", ratio(spend, qualified, brl), "Investimento ÷ leads qualificados."],
    ["Custo por agendamento", ratio(spend, appointments, brl), "Investimento ÷ agendamentos."],
    ["CAC de mídia", ratio(spend, customers, brl), "Investimento em mídia ÷ novos clientes."],
    ["ROAS", ratio(revenue, spend, (v) => v.toFixed(2) + "x"), "Receita atribuída ÷ investimento."],
    ["Clique → lead", ratio(leads * 100, clicks, pct), "Leads recebidos ÷ cliques."],
    ["Taxa de qualificação", ratio(qualified * 100, leads, pct), "Leads qualificados ÷ leads recebidos."],
    ["Qualificado → agendamento", ratio(appointments * 100, qualified, pct), "Agendamentos ÷ leads qualificados."],
    ["Lead → cliente", ratio(customers * 100, leads, pct), "Novos clientes ÷ leads recebidos."]
  ];

  results.innerHTML = metrics.map(([title, value, explanation]) =>
    card(title, value, explanation)
  ).join("");
});

form.addEventListener("reset", () => {
  results.innerHTML = '<p class="empty">Preencha os dados e clique em “Calcular indicadores”.</p>';
});
