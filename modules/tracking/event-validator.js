(function(root,factory){
 const api=factory();
 if(typeof module==="object"&&module.exports)module.exports=api;
 if(root)root.EKOADS_EVENT_VALIDATOR=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 const allowedEvents=new Set(["hero_cta_click","form_start","click_whatsapp","whatsapp_handoff"]);
 const allowedKeys=new Set(["event","page_id","utm_source","utm_medium","utm_campaign","utm_content","utm_term"]);
 const forbiddenKeys=/name|email|phone|telefone|mobile|address|diagnosis|diagnost|symptom|sintoma|patient|paciente|message|mensagem|cpf|birth|nascimento/i;
 const personalValue=/(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})|(?:\+?\d[\d\s().-]{8,}\d)/i;
 function validateEvent(payload){
  const errors=[];
  if(!payload||typeof payload!=="object"||Array.isArray(payload))return {valid:false,errors:["Evento deve ser um objeto."]};
  if(!allowedEvents.has(payload.event))errors.push("Evento não permitido ou não documentado.");
  if(typeof payload.page_id!=="string"||!payload.page_id.trim()||payload.page_id.length>80)errors.push("page_id ausente ou inválido.");
  for(const [key,value] of Object.entries(payload)){
   if(forbiddenKeys.test(key))errors.push("Chave potencialmente pessoal/sensível bloqueada: "+key);
   if(!allowedKeys.has(key))errors.push("Parâmetro não permitido: "+key);
   if(key!=="event"&&key!=="page_id"){
    if(typeof value!=="string"||value.length>120)errors.push("Parâmetro deve ser texto de até 120 caracteres: "+key);
    else if(personalValue.test(value))errors.push("Valor parece conter e-mail ou telefone: "+key);
   }
  }
  return {valid:errors.length===0,errors};
 }
 function validateBatch(events){
  if(!Array.isArray(events))return {valid:false,results:[],errors:["A entrada deve ser uma lista de eventos."]};
  const results=events.map((event,index)=>({index,...validateEvent(event)}));
  return {valid:results.every(x=>x.valid),results,errors:results.flatMap(x=>x.errors.map(e=>"Evento "+x.index+": "+e))};
 }
 return {allowedEvents:Array.from(allowedEvents),validateEvent,validateBatch};
});
