const test=require("node:test");
const assert=require("node:assert/strict");
const {calculate,validate,aggregateStages}=require("../modules/analytics/dashboard-core.js");
const sample={spend:1000,otherCosts:300,margin:60,revenue:8000,impressions:10000,clicks:500,leads:50,qualified:30,appointments:20,attended:15,customers:8};

test("calcula corretamente os indicadores consolidados do dashboard",()=>{
 const r=calculate(sample);assert.equal(r.valid,true);
 assert.equal(r.metrics.ctr,.05);assert.equal(r.metrics.cpc,2);
 assert.equal(r.metrics.cpl,20);assert.equal(r.metrics.cpql,1000/30);
 assert.equal(r.metrics.costPerAppointment,50);assert.equal(r.metrics.cac,162.5);
 assert.equal(r.metrics.roas,8);assert.equal(r.metrics.grossProfit,4800);
 assert.equal(r.metrics.contribution,3500);
});
test("rejeita funil e mídia inconsistentes",()=>{
 assert.ok(validate({...sample,clicks:10001}).some(x=>x.includes("Cliques")));
 assert.ok(validate({...sample,qualified:51}).some(x=>x.includes("Qualificados")));
 assert.ok(validate({...sample,attended:21}).some(x=>x.includes("Comparecimentos")));
 assert.ok(validate({...sample,customers:16}).some(x=>x.includes("Vendas")));
});
test("rejeita contagens fracionárias e margem acima de 100%",()=>{
 assert.ok(validate({...sample,leads:1.5}).some(x=>x.includes("inteiro")));
 assert.ok(validate({...sample,margin:101}).some(x=>x.includes("Margem")));
});
test("devolve null para métricas sem denominador",()=>{
 const r=calculate({...sample,spend:0,impressions:0,clicks:0,leads:0,qualified:0,appointments:0,customers:0});
 for(const v of Object.values(r.metrics).slice(0,7))assert.equal(v,null);
});
test("agrega estados atuais cumulativamente e soma receita apenas em vendas",()=>{
 const r=aggregateStages([
  {stage:"received",value:0},{stage:"qualified",value:0},
  {stage:"scheduled",value:0},{stage:"attended",value:0},
  {stage:"won",value:500},{stage:"lost",value:0}
 ]);
 assert.deepEqual(r,{leads:5,qualified:4,appointments:3,attended:2,customers:1,revenue:500});
});
test("não inclui perdidos no funil cumulativo",()=>{
 const r=aggregateStages([{stage:"lost",value:0},{stage:"received",value:0}]);
 assert.deepEqual(r,{leads:1,qualified:0,appointments:0,attended:0,customers:0,revenue:0});
});
