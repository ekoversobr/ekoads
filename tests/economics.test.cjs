const test=require("node:test");
const assert=require("node:assert/strict");
const {calculate,validate}=require("../modules/analytics/economics-core.js");
const sample={adSpend:1000,otherCosts:300,deliveryCosts:200,leads:50,qualified:30,appointments:20,customers:8,revenue:8000,margin:60};

test("calcula custos, ROAS e contribuição econômica",()=>{
 const r=calculate(sample);
 assert.equal(r.valid,true);
 assert.equal(r.metrics.cpl,20);
 assert.equal(r.metrics.cpql,1000/30);
 assert.equal(r.metrics.costAppointment,50);
 assert.equal(r.metrics.mediaCAC,125);
 assert.equal(r.metrics.fullCAC,162.5);
 assert.equal(r.metrics.roas,8);
 assert.equal(r.metrics.grossProfit,4800);
 assert.equal(r.metrics.contribution,3300);
 assert.equal(r.metrics.marketingReturn,3300/1300);
 assert.equal(r.metrics.breakEvenCAC,600);
});
test("retorna null para custos unitários sem volume e ROAS sem mídia",()=>{
 const r=calculate({adSpend:0,otherCosts:0,deliveryCosts:0,leads:0,qualified:0,appointments:0,customers:0,revenue:0,margin:50});
 assert.equal(r.valid,true);
 for(const k of ["cpl","cpql","costAppointment","mediaCAC","fullCAC","roas","qualification","qualifiedToAppointment","appointmentToCustomer","leadToCustomer","marketingReturn","breakEvenCAC"])assert.equal(r.metrics[k],null);
});
test("rejeita funil fora de sequência",()=>{
 assert.ok(validate({...sample,qualified:51}).some(x=>x.includes("qualificados")));
 assert.ok(validate({...sample,appointments:31}).some(x=>x.includes("Agendamentos")));
 assert.ok(validate({...sample,customers:21}).some(x=>x.includes("Novos clientes")));
});
test("rejeita valores negativos, fracionários e margem acima de 100%",()=>{
 assert.ok(validate({...sample,adSpend:-1}).some(x=>x.includes("adSpend")));
 assert.ok(validate({...sample,leads:2.5}).some(x=>x.includes("inteiro")));
 assert.ok(validate({...sample,margin:100.1}).some(x=>x.includes("100%")));
});
test("rejeita números não finitos",()=>{
 assert.ok(validate({...sample,revenue:Infinity}).some(x=>x.includes("revenue")));
});
