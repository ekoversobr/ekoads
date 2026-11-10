(function(root,factory){
 const api=factory();
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
 root.EkoAdsDashboard=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 function validate(d){
  const errors=[];
  for(const k of ["spend","otherCosts","margin","revenue"]){if(!Number.isFinite(Number(d[k]))||Number(d[k])<0)errors.push(k+" deve ser não negativo.");}
  for(const k of ["impressions","clicks","leads","qualified","appointments","attended","customers"]){if(!Number.isInteger(Number(d[k]))||Number(d[k])<0)errors.push(k+" deve ser inteiro não negativo.");}
  if(errors.length)return errors;
  if(d.clicks>d.impressions)errors.push("Cliques superam impressões.");
  if(d.qualified>d.leads)errors.push("Qualificados superam leads recebidos.");
  if(d.appointments>d.qualified)errors.push("Agendamentos superam leads qualificados.");
  if(d.attended>d.appointments)errors.push("Comparecimentos superam agendamentos.");
  if(d.customers>d.attended)errors.push("Vendas superam comparecimentos.");
  if(d.margin>100)errors.push("Margem não pode superar 100%.");
  return errors;
 }
 function calculate(d){
  const errors=validate(d);
  if(errors.length)return{valid:false,errors,metrics:null};
  const div=(a,b)=>b>0?a/b:null;
  const gross=d.revenue*d.margin/100;
  return{valid:true,errors:[],metrics:{
   ctr:div(d.clicks,d.impressions),cpc:div(d.spend,d.clicks),
   cpl:div(d.spend,d.leads),cpql:div(d.spend,d.qualified),
   costPerAppointment:div(d.spend,d.appointments),
   cac:div(d.spend+d.otherCosts,d.customers),
   roas:div(d.revenue,d.spend),grossProfit:gross,
   contribution:gross-d.otherCosts-d.spend
  }};
 }
 function aggregateStages(records){
  const rank={received:0,qualified:1,scheduled:2,attended:3,won:4};
  const counts=[0,0,0,0,0];let revenue=0;
  for(const r of records){const n=rank[r.stage];if(n!==undefined){for(let i=0;i<=n;i++)counts[i]++;if(r.stage==="won")revenue+=Number(r.value)||0;}}
  return{leads:counts[0],qualified:counts[1],appointments:counts[2],attended:counts[3],customers:counts[4],revenue};
 }
 return{validate,calculate,aggregateStages};
});
