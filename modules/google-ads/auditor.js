const fileInput = document.querySelector("#csv-file");
const statusNode = document.querySelector("#file-status");
const summaryNode = document.querySelector("#summary");
const alertsNode = document.querySelector("#alerts");
const wasteNode = document.querySelector("#waste-rows");
const bestNode = document.querySelector("#best-rows");

const normalize = (value) => String(value ?? "")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function parseCSV(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] || "";
  const candidates = [",", ";", "\t"];
  const delimiter = candidates
    .map((char) => ({ char, count: (firstLine.match(new RegExp(char === "\t" ? "\\t" : char, "g")) || []).length }))
    .sort((a, b) => b.count - a.count)[0].char;

  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (ch === '"' && quoted && next === '"') { cell += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === delimiter && !quoted) { row.push(cell); cell = ""; }
    else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && next === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((v) => v.trim() !== "")) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((v) => v.trim() !== "")) rows.push(row);
  return rows;
}

function parseNumber(value) {
  let s = String(value ?? "").trim().replace(/[R$€£\s%]/g, "").replace(/[^0-9,.-]/g, "");
  if (!s || s === "-") return 0;
  const comma = s.lastIndexOf(",");
  const dot = s.lastIndexOf(".");
  if (comma > dot) s = s.replace(/\./g, "").replace(",", ".");
  else if (dot > comma && comma !== -1) s = s.replace(/,/g, "");
  else if (comma !== -1 && dot === -1) s = s.replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function findColumn(headers, aliases) {
  const normalized = headers.map(normalize);
  for (const alias of aliases) {
    const index = normalized.findIndex((h) => h === normalize(alias));
    if (index !== -1) return index;
  }
  return -1;
}

const money = (v) => new Intl.NumberFormat("pt-BR", {style:"currency",currency:"BRL"}).format(v);
const percent = (v) => new Intl.NumberFormat("pt-BR", {maximumFractionDigits:2}).format(v) + "%";
const metric = (label, value, note) =>
  `<article class="metric"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`;
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[c]));

function renderTable(target, rows, emptyText, renderRow) {
  target.innerHTML = rows.length ? rows.map(renderRow).join("") :
    `<tr><td colspan="5">${emptyText}</td></tr>`;
}

fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    statusNode.textContent = "Arquivo maior que 5 MB. Exporte um período ou relatório menor.";
    return;
  }
  try {
    const text = (await file.text()).replace(/^\uFEFF/, "");
    const table = parseCSV(text);
    if (table.length < 2) throw new Error("O CSV não contém linhas de dados suficientes.");
    const headers = table[0].map((h) => h.trim());
    const termCol = findColumn(headers, ["Termo de pesquisa","Termo de pesquisa","Search term","Keyword","Palavra-chave","Palavra chave"]);
    const impressionsCol = findColumn(headers, ["Impressões","Impr.","Impressions"]);
    const clicksCol = findColumn(headers, ["Cliques","Clicks"]);
    const costCol = findColumn(headers, ["Custo","Cost"]);
    const conversionsCol = findColumn(headers, ["Conversões","Conv.","Conversions"]);
    const valueCol = findColumn(headers, ["Valor de conversão","Valor conv.","Conv. value","Conversion value"]);

    if (clicksCol < 0 || costCol < 0) {
      throw new Error("Não encontrei as colunas obrigatórias Cliques e Custo. Confira os cabeçalhos do CSV.");
    }

    const data = table.slice(1).map((cells) => ({
      term: termCol >= 0 ? (cells[termCol] || "(linha sem termo)").trim() : "(termo não disponível)",
      impressions: impressionsCol >= 0 ? parseNumber(cells[impressionsCol]) : 0,
      clicks: parseNumber(cells[clicksCol]),
      cost: parseNumber(cells[costCol]),
      conversions: conversionsCol >= 0 ? parseNumber(cells[conversionsCol]) : 0,
      value: valueCol >= 0 ? parseNumber(cells[valueCol]) : 0
    })).filter((r) => r.clicks || r.cost || r.impressions || r.conversions);

    if (!data.length) throw new Error("Não encontrei linhas com métricas numéricas.");
    const totals = data.reduce((a, r) => ({
      impressions: a.impressions + r.impressions,
      clicks: a.clicks + r.clicks,
      cost: a.cost + r.cost,
      conversions: a.conversions + r.conversions,
      value: a.value + r.value
    }), {impressions:0,clicks:0,cost:0,conversions:0,value:0});

    const ctr = totals.impressions ? totals.clicks / totals.impressions * 100 : 0;
    const cpc = totals.clicks ? totals.cost / totals.clicks : null;
    const cpa = totals.conversions ? totals.cost / totals.conversions : null;
    const roas = totals.cost ? totals.value / totals.cost : null;

    summaryNode.innerHTML = [
      metric("Linhas analisadas", data.length, "Registros com métricas."),
      metric("Impressões", totals.impressions.toLocaleString("pt-BR"), "Soma das linhas importadas."),
      metric("Cliques", totals.clicks.toLocaleString("pt-BR"), "Soma das linhas importadas."),
      metric("CTR", percent(ctr), "Cliques ÷ impressões."),
      metric("Investimento", money(totals.cost), "Custo total informado."),
      metric("CPC médio", cpc === null ? "—" : money(cpc), "Custo ÷ cliques."),
      metric("Conversões", totals.conversions.toLocaleString("pt-BR"), "Conversões reportadas pelo Ads."),
      metric("CPA", cpa === null ? "—" : money(cpa), "Custo ÷ conversões."),
      metric("ROAS", roas === null ? "—" : roas.toFixed(2) + "x", "Valor conv. ÷ custo; se disponível.")
    ].join("");

    const waste = data.filter((r) => r.cost > 0 && r.conversions === 0)
      .sort((a,b) => b.cost - a.cost).slice(0, 20);
    const best = data.filter((r) => r.conversions > 0)
      .sort((a,b) => b.conversions - a.conversions).slice(0, 20);

    renderTable(wasteNode, waste, "Nenhuma linha com gasto e zero conversões neste arquivo.", (r) =>
      `<tr><td>${escapeHTML(r.term)}</td><td>${r.clicks}</td><td>${money(r.cost)}</td><td>${r.impressions ? percent(r.clicks/r.impressions*100) : "—"}</td><td>Revisar intenção, qualidade e janela de conversão.</td></tr>`);
    renderTable(bestNode, best, "Nenhuma conversão registrada nas linhas importadas.", (r) =>
      `<tr><td>${escapeHTML(r.term)}</td><td>${r.conversions}</td><td>${money(r.cost)}</td><td>${money(r.cost/r.conversions)}</td><td>Avaliar qualidade e resultado comercial.</td></tr>`);

    const alerts = [];
    if (impressionsCol < 0) alerts.push("Coluna de impressões ausente: CTR não é calculável por linha.");
    if (conversionsCol < 0) alerts.push("Coluna de conversões ausente: não é possível avaliar CPA ou gasto sem conversão.");
    if (termCol < 0) alerts.push("Coluna de termo/palavra-chave ausente: análise por termo não estará disponível.");
    if (!waste.length) alerts.push("Não foram encontradas linhas com custo positivo e zero conversões.");
    if (waste.length) alerts.push(`${waste.length} linha(s) com custo e zero conversões. Priorize revisão manual antes de negativar ou pausar.`);
    alertsNode.innerHTML = `<ul class="notes">${alerts.map((a) => `<li>${escapeHTML(a)}</li>`).join("")}</ul>`;
    statusNode.textContent = `Arquivo analisado: ${file.name} · ${data.length} linhas válidas.`;
  } catch (error) {
    statusNode.textContent = error.message;
    summaryNode.innerHTML = '<p class="empty">Não foi possível concluir a análise. Verifique o CSV.</p>';
    alertsNode.innerHTML = '<p class="empty">Corrija o arquivo e importe novamente.</p>';
  }
});
