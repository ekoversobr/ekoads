(function(){
"use strict";
const cfg=window.EKOADS_CONFIG||{};
const digits=String(cfg.whatsappNumber||"").replace(/\D/g,"");
const form=document.querySelector("#lead-form");
const consent=document.querySelector("#consent");
const error=document.querySelector("#form-error");
const analyticsConsent=document.querySelector("#analytics-consent");
const nameField=document.querySelector("#lead-name");
const subjectField=document.querySelector("#lead-subject");
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

const privacyLink=document.querySelector("#privacy-link");
const modal=document.querySelector("#privacy-modal");
if(privacyLink){
 if(cfg.privacyUrl){privacyLink.href=cfg.privacyUrl;privacyLink.target="_blank";privacyLink.rel="noopener";}
 else if(modal){privacyLink.addEventListener("click",e=>{e.preventDefault();modal.hidden=false;});}
}
const closePrivacy=document.querySelector("#close-privacy");
if(closePrivacy&&modal)closePrivacy.addEventListener("click",()=>modal.hidden=true);
if(modal)modal.addEventListener("click",e=>{if(e.target===modal)modal.hidden=true;});
document.querySelectorAll("[data-track]").forEach(el=>el.addEventListener("click",()=>event(el.dataset.track)));

function trackFormStart(){
 if(!form||form.dataset.started==="1"||!analyticsConsent?.checked)return;
 if(!nameField||!String(nameField.value||"").trim())return;
 if(event("form_start"))form.dataset.started="1";
}
if(nameField){
 nameField.addEventListener("input",trackFormStart);
 nameField.addEventListener("change",trackFormStart);
}
if(analyticsConsent){
 analyticsConsent.addEventListener("change",()=>{if(analyticsConsent.checked)trackFormStart();});
}

if(form){
 form.addEventListener("submit",e=>{
  e.preventDefault();
  if(error){error.textContent="";error.classList.remove("success");}
  const name=String(nameField?.value||"").trim();
  const subject=String(subjectField?.value||"").trim();
  if(!name){
   if(error)error.textContent="Informe seu nome para continuar.";
   nameField?.focus();
   return;
  }
  if(!subject){
   if(error)error.textContent="Selecione o assunto do seu contato.";
   subjectField?.focus();
   return;
  }
  if(!consent||!consent.checked){
   if(error)error.textContent="Marque o consentimento para continuar.";
   consent?.focus();
   return;
  }
  if(!/^\d{12,15}$/.test(digits)){
   if(error)error.textContent="Número de teste não configurado corretamente.";
   return;
  }
  event("click_whatsapp");
  event("whatsapp_handoff");
  if(error){
   error.textContent=cfg.demoMode
    ?"AMBIENTE DE TESTES: a conversa será aberta no WhatsApp. Nenhuma mensagem será enviada automaticamente."
    :"O WhatsApp será aberto para você revisar a mensagem antes de enviar.";
   error.setAttribute("role","status");
   error.classList.add("success");
  }
  const message=cfg.demoMode
   ?"Olá! Estou testando o fluxo de contato do EKOADS.\nNome: "+name+"\nAssunto: "+subject
   :"Olá! Meu nome é "+name+" e gostaria de informações sobre: "+subject+".";
  const url="https://wa.me/"+digits+"?text="+encodeURIComponent(message);
  const opened=window.open(url,"_blank");
  if(opened)opened.opener=null;else window.location.href=url;
 });
}
document.querySelectorAll('a[href*="wa.me"]').forEach(el=>el.addEventListener("click",()=>event("click_whatsapp")));
})();