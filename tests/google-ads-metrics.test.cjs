const test = require("node:test");
const assert = require("node:assert/strict");
const { calculate, validate } = require("../modules/google-ads/metrics-core.js");

const sample = { impressions:10000, clicks:500, spend:1000, leads:50, qualified:30, appointments:20, customers:8, revenue:8000 };

test("calcula corretamente os indicadores principais", () => {
  const result=calculate(sample);
  assert.equal(result.valid,true);
  assert.equal(result.metrics.ctr,0.05);
  assert.equal(result.metrics.cpc,2);
  assert.equal(result.metrics.cpl,20);
  assert.equal(result.metrics.cpql,1000/30);
  assert.equal(result.metrics.costPerAppointment,50);
  assert.equal(result.metrics.mediaCAC,125);
  assert.equal(result.metrics.roas,8);
  assert.equal(result.metrics.clickToLead,0.1);
  assert.equal(result.metrics.qualificationRate,0.6);
  assert.equal(result.metrics.qualifiedToAppointment,2/3);
  assert.equal(result.metrics.leadToCustomer,0.16);
});

test("retorna null quando o denominador é zero", () => {
  const result=calculate({impressions:0,clicks:0,spend:0,leads:0,qualified:0,appointments:0,customers:0,revenue:0});
  assert.equal(result.valid,true);
  for(const value of Object.values(result.metrics)) assert.equal(value,null);
});

test("rejeita cliques acima de impressões", () => {
  assert.match(validate({...sample,clicks:10001})[0],/Cliques/);
});

test("rejeita etapas comerciais fora da sequência", () => {
  assert.match(validate({...sample,appointments:31})[0],/Agendamentos/);
});

test("rejeita valores negativos e contagens fracionárias", () => {
  assert.ok(validate({...sample,spend:-1}).some(x=>x.includes("spend")));
  assert.ok(validate({...sample,clicks:1.5}).some(x=>x.includes("clicks")));
});

test("não aceita valores não finitos", () => {
  assert.ok(validate({...sample,revenue:Infinity}).some(x=>x.includes("revenue")));
});
