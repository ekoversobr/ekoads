(function(){
"use strict";
const cfg=window.EKOADS_CONFIG||{};
const digits=String(cfg.whatsappNumber||"").replace(/\D/g,"");
const form=document.querySelector("#lead-form"),consent=document.querySelector("#consent"),error=document.querySelector("#form-error");
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
 // Não acumula eventos pré-consentimento para envio retroativo quando o GTM for carregado.
 const analyticsConsent=document.querySelector("#analytics-consent");
 if(!analyticsConsent||!analyticsConsent.checked)return;
 const payload={event:name,page_id:pageId,...attribution,...extra};
 const validator=window.EKOADS_EVENT_VALIDATOR;
 if(validator){
  const result=validator.validateEvent(payload);
  if(!result.valid){console.warn("EKOADS tracking event rejected",result.errors);return;}
 }
 window.dataLayer=window.dataLayer||[];
 window.dataLayer.push(payload);
}
document.title=(cfg.brandName||"Sua marca")+" | Atendimento";
document.querySelectorAll(".brand").forEach(x=>x.textContent=cfg.brandName||"SUA MARCA");
document.querySelector("#year").textContent=new Date().getFullYear();
const privacyLink=document.querySelector("#privacy-link"),modal=document.querySelector("#privacy-modal");
if(cfg.privacyUrl){privacyLink.href=cfg.privacyUrl;privacyLink.target="_blank";privacyLink.rel="noopener";}
else{privacyLink.addEventListener("click",e=>{e.preventDefault();modal.hidden=false;});}
document.querySelector("#close-privacy").addEventListener("click",()=>modal.hidden=true);
modal.addEventListener("click",e=>{if(e.target===modal)modal.hidden=true;});
document.querySelectorAll("[data-track]").forEach(el=>el.addEventListener("click",()=>event(el.dataset.track)));
form.addEventListener("input",()=>{if(!form.dataset.started){form.dataset.started="1";event("form_start");}});
form.addEventListener("submit",e=>{
 e.preventDefault();error.textContent="";
 if(!consent.checked){error.textContent="Marque o consentimento para continuar.";consent.focus();return;}
 if(cfg.demoMode){
  event("whatsapp_handoff");
  error.textContent="SIMULAÇÃO CONCLUÍDA: nenhum WhatsApp foi aberto e nenhuma mensagem foi enviada.";
  error.setAttribute("role","status");
  return;
 }
 if(!/^\d{12,15}$/.test(digits)||digits==="5500000000000"){error.textContent="O WhatsApp ainda não foi configurado. Atualize config.js.";return;}
 const url="https://wa.me/"+digits+"?text="+encodeURIComponent("Olá! Gostaria de receber informações e conhecer os próximos passos.");
 event("whatsapp_handoff");
 const opened=window.open(url,"_blank");
 if(opened)opened.opener=null;else window.location.href=url;
});
document.querySelectorAll('a[href*="wa.me"]').forEach(el=>el.addEventListener("click",()=>event("click_whatsapp")));
})();