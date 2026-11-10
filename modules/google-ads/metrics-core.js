(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.EkoAdsMetrics = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const COUNT_FIELDS = ["impressions", "clicks", "leads", "qualified", "appointments", "customers"];
  const MONEY_FIELDS = ["spend", "revenue"];

  function validate(data) {
    const errors = [];
    for (const field of COUNT_FIELDS) {
      const value = Number(data[field] ?? 0);
      if (!Number.isFinite(value) || value < 0 || !Number.isInteger(value)) {
        errors.push(field + " deve ser um número inteiro não negativo.");
      }
    }
    for (const field of MONEY_FIELDS) {
      const value = Number(data[field] ?? 0);
      if (!Number.isFinite(value) || value < 0) {
        errors.push(field + " deve ser um número não negativo.");
      }
    }
    const d = Object.fromEntries([...COUNT_FIELDS, ...MONEY_FIELDS].map(k => [k, Number(data[k] ?? 0)]));
    if (!errors.length) {
      if (d.clicks > d.impressions) errors.push("Cliques não podem superar impressões.");
      if (d.qualified > d.leads) errors.push("Leads qualificados não podem superar leads recebidos.");
      if (d.appointments > d.qualified) errors.push("Agendamentos não podem superar leads qualificados.");
      if (d.customers > d.appointments) errors.push("Novos clientes não podem superar agendamentos.");
    }
    return errors;
  }

  function calculate(data) {
    const errors = validate(data);
    if (errors.length) return { valid: false, errors, metrics: null };
    const d = Object.fromEntries([...COUNT_FIELDS, ...MONEY_FIELDS].map(k => [k, Number(data[k] ?? 0)]));
    const divide = (a, b) => b > 0 ? a / b : null;
    return {
      valid: true,
      errors: [],
      metrics: {
        ctr: divide(d.clicks, d.impressions),
        cpc: divide(d.spend, d.clicks),
        cpl: divide(d.spend, d.leads),
        cpql: divide(d.spend, d.qualified),
        costPerAppointment: divide(d.spend, d.appointments),
        mediaCAC: divide(d.spend, d.customers),
        roas: divide(d.revenue, d.spend),
        clickToLead: divide(d.leads, d.clicks),
        qualificationRate: divide(d.qualified, d.leads),
        qualifiedToAppointment: divide(d.appointments, d.qualified),
        leadToCustomer: divide(d.customers, d.leads)
      }
    };
  }

  return { validate, calculate };
});
