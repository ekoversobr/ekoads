(function(){
"use strict";
const cfg=window.EKOADS_CONFIG||{};
const digits=String(cfg.whatsappNumber||"").replace(/\D/g,"");
const form=document.querySelector("#lead-form"),consent=document.querySelector("#consent"),error=document.querySelector("#form-error");
const analyticsConsent=document.querySelector("#analytics-consent");
const allowed=["utm_source","utm_medium","utm_campaign","utm_content","utm_term"];
function readAttribution(){
 const current=new URLSearchParams(window.location.search),saved={};
 allowed.forEach(k=>{const v=current.get(k);if(v&&v.length<=120)saved[k]=v;});
 if(Object.keys(saved).length){try{sessionStorage.setItem("ekoads_attribution",JSON.stringify(saved));}catch{}}
 try{return JSON.parse(sessionStorage.getItem("ekoads_attribution")||"{}");}catch{return {};}
}
const attribution=readAttribution();
const pageId=String(cfg.pageId||"landing-page").slice(0,80);
function event(name,extra={}){
 // Eventos só são enviados após consentimento analítico explícito.
 if(!analyticsConsent||!analyticsConsent.checked)return false;
 const payload={event:name,page_id:pageId,...attribution,...extra};
 const validator=window.EKOADS_EVENT_VALIDATOR;
 if(validator){
  const result=validator.validateEvent(payload);
  if(!result.valid){console.warn("EKOADS tracking event rejected",result.errors);return false;}
 }
 window.dataLayer=window.dataLayer||[];
 window.dataLayer.push(payload);
 return true;
}
document.title=(cfg.brandName||"Sua marca")+" | Atendimento";
document.querySelectorAll(".brand-name").forEach(x=>x.textContent=cfg.brandName||"SUA MARCA");
const year=document.querySelector("#year");
if(year)year.textContent=new Date().getFullYear();
const privacyLink=document.querySelector("#privacy-link"),modal=document.querySelector("#privacy-modal");
if(privacyLink){
 if(cfg.privacyUrl){privacyLink.href=cfg.privacyUrl;privacyLink.target="_blank";privacyLink.rel="noopener";}
 else if(modal){privacyLink.addEventListener("click",e=>{e.preventDefault();modal.hidden=false;});}
}
const closePrivacy=document.querySelector("#close-privacy");
if(closePrivacy&&modal)closePrivacy.addEventListener("click",()=>modal.hidden=true);
if(modal)modal.addEventListener("click",e=>{if(e.target===modal)modal.hidden=true;});
document.querySelectorAll("[data-track]").forEach(el=>el.addEventListener("click",()=>event(el.dataset.track)));

function trackFormStart(){
 if(!form||form.dataset.started==="1")return;
 const nameField=document.querySelector("#lead-name");
 const hasInput=!!(nameField&&String(nameField.value||"").trim());
 if(!hasInput)return;
 if(event("form_start")){
  form.dataset.started="1";
 }else{
  console.warn("EKOADS: form_start não enviado; verifique consentimento e validador.");
 }
}
const nameField=document.querySelector("#lead-name");
if(nameField){
 nameField.addEventListener("input",trackFormStart);
 nameField.addEventListener("change",trackFormStart);
}
 form.addEventListener("submit",e=>{
  e.preventDefault();
  if(error){error.textContent="";error.classList.remove("success");}
  if(!consent||!consent.checked){if(error)error.textContent="Marque o consentimento para continuar.";if(consent)consent.focus();return;}
  if(cfg.demoMode){
   if(!/^\d{12,15}$/.test(digits)){if(error)error.textContent="Número de teste não configurado corretamente.";return;}
   event("click_whatsapp");
   event("whatsapp_handoff");
   if(error){error.textContent="AMBIENTE DE TESTES: a conversa será aberta no WhatsApp. Nenhuma mensagem será enviada automaticamente.";error.setAttribute("role","status");error.classList.add("success");}
   const testUrl="https://wa.me/"+digits+"?text="+encodeURIComponent("Olá! Estou testando o fluxo de contato do EKOADS.");
   const opened=window.open(testUrl,"_blank");
   if(opened)opened.opener=null;else window.location.href=testUrl;
   return;
  }
  if(!/^\d{12,15}$/.test(digits)||digits==="5500000000000"){if(error)error.textContent="O WhatsApp ainda não foi configurado. Atualize config.js.";return;}
  const url="https://wa.me/"+digits+"?text="+encodeURIComponent("Olá! Gostaria de receber informações e conhecer os próximos passos.");
  event("click_whatsapp");
  event("whatsapp_handoff");
  const opened=window.open(url,"_blank");
  if(opened)opened.opener=null;else window.location.href=url;
 });
}
if(analyticsConsent)analyticsConsent.addEventListener("change",()=>{
 if(analyticsConsent.checked)trackFormStart();
});
document.querySelectorAll('a[href*="wa.me"]').forEach(el=>el.addEventListener("click",()=>event("click_whatsapp")));
})();