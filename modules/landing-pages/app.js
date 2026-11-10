(function(){
"use strict";
const cfg=window.EKOADS_CONFIG||{};
const digits=String(cfg.whatsappNumber||"").replace(/\D/g,"");
const form=document.querySelector("#lead-form"),nameInput=document.querySelector("#first-name"),consent=document.querySelector("#consent"),error=document.querySelector("#form-error");
const event=(name)=>{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:name,page_id:String(cfg.pageId||"landing-page")});};
document.title=(cfg.brandName||"Sua marca")+" | Atendimento";
document.querySelectorAll(".brand").forEach(x=>x.textContent=cfg.brandName||"SUA MARCA");
document.querySelector("footer span").firstChild.textContent="© "+new Date().getFullYear()+" ";
document.querySelector("#year").textContent=new Date().getFullYear();
const privacyLink=document.querySelector("#privacy-link"),modal=document.querySelector("#privacy-modal");
if(cfg.privacyUrl){privacyLink.href=cfg.privacyUrl;privacyLink.target="_blank";privacyLink.rel="noopener";}else{privacyLink.addEventListener("click",e=>{e.preventDefault();modal.hidden=false;});}
document.querySelector("#close-privacy").addEventListener("click",()=>modal.hidden=true);
modal.addEventListener("click",e=>{if(e.target===modal)modal.hidden=true;});
document.querySelectorAll("[data-track]").forEach(el=>el.addEventListener("click",()=>event(el.dataset.track)));
form.addEventListener("submit",e=>{
 e.preventDefault();error.textContent="";
 const name=nameInput.value.trim();
 if(!name||name.length>60){error.textContent="Informe um primeiro nome válido.";nameInput.focus();return;}
 if(!consent.checked){error.textContent="Marque o consentimento para continuar.";consent.focus();return;}
 if(!/^\d{12,15}$/.test(digits)||digits==="5500000000000"){error.textContent="O WhatsApp ainda não foi configurado. Atualize config.js.";return;}
 event("contact_form_validated");
 const message="Olá! Meu nome é "+name+". Gostaria de receber informações e conhecer os próximos passos.";
 const url="https://wa.me/"+digits+"?text="+encodeURIComponent(message);
 const opened=window.open(url,"_blank","noopener,noreferrer");
 if(!opened)window.location.href=url;
 // Este evento registra apenas a tentativa de abrir o canal; não comprova mensagem enviada ou recebida.
 event("whatsapp_handoff_attempt");
});
})();