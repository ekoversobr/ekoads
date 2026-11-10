(function(root,factory){
 const api=factory();
 if(typeof module!=="undefined"&&module.exports)module.exports=api;
 root.EkoAdsEconomics=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 function validate(d){
  const errors=[];
  const numeric=["adSpend","otherCosts","deliveryCosts","leads","qualified","appointments","customers","revenue","margin"];
  for(const key of numeric){
   const value=Number(d[key]??0);
   if(!Number.isFinite(value)||value<0)errors.push(key+" deve ser um número não negativo.");
  }
  for(const key of ["leads","qualified","appointments","customers"]){
   const value=Number(d[key]??0);
   if(!Number.isInteger(value))errors.push(key+" deve ser um número inteiro.");
  }
  if(errors.length)return errors;
  if(d.qualified>d.leads)errors.push("Leads qualificados não podem superar leads recebidos.");
  if(d.appointments>d.qualified)errors.push("Agendamentos não podem superar leads qualificados.");
  if(d.customers>d.appointments)errors.push("Novos clientes não podem superar agendamentos.");
  if(d.margin>100)errors.push("Margem bruta não pode superar 100%.");
  return errors;
 }
 function calculate(d){
  const errors=validate(d);
  if(errors.length)return{valid:false,errors,metrics:null,totalAcquisitionCost:null};
  const divide=(a,b)=>b>0?a/b:null;
  const totalAcquisitionCost=d.adSpend+d.otherCosts;
  const grossProfit=d.revenue*d.margin/100;
  const contribution=grossProfit-d.deliveryCosts-totalAcquisitionCost;
  const metrics={
   cpl:divide(d.adSpend,d.leads),
   cpql:divide(d.adSpend,d.qualified),
   costAppointment:divide(d.adSpend,d.appointments),
   mediaCAC:divide(d.adSpend,d.customers),
   fullCAC:divide(totalAcquisitionCost,d.customers),
   roas:divide(d.revenue,d.adSpend),
   qualification:divide(d.qualified,d.leads),
   qualifiedToAppointment:divide(d.appointments,d.qualified),
   appointmentToCustomer:divide(d.customers,d.appointments),
   leadToCustomer:divide(d.customers,d.leads),
   grossProfit,
   contribution,
   marketingReturn:divide(contribution,totalAcquisitionCost),
   breakEvenCAC:d.customers>0?grossProfit/d.customers:null
  };
  return{valid:true,errors:[],metrics,totalAcquisitionCost};
 }
 return{validate,calculate};
});
