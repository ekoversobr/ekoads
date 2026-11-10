(function(){
"use strict";
const cfg=window.EKOADS_CONFIG||{};
const checkbox=document.querySelector("#analytics-consent");
const id=String(cfg.gtmId||"").trim();
const valid=/^GTM-[A-Z0-9]+$/.test(id);
let loaded=false;
function load(){
 if(loaded||!valid)return;
 loaded=true;
 window.dataLayer=window.dataLayer||[];
 window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
 window.gtag("consent","default",{
  ad_storage:"denied",analytics_storage:"denied",
  ad_user_data:"denied",ad_personalization:"denied",
  functionality_storage:"denied",personalization_storage:"denied",
  security_storage:"granted"
 });
 window.gtag("consent","update",{
  analytics_storage:"granted"
 });
 window.dataLayer.push({"gtm.start":Date.now(),event:"gtm.js"});
 const script=document.createElement("script");
 script.async=true;
 script.src="https://www.googletagmanager.com/gtm.js?id="+encodeURIComponent(id);
 script.onerror=function(){loaded=false;};
 document.head.appendChild(script);
}
if(checkbox){
 checkbox.addEventListener("change",function(){
  if(checkbox.checked)load();
  else if(loaded){
   window.dataLayer=window.dataLayer||[];
   window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
   window.gtag("consent","update",{analytics_storage:"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"});
  }
 });
}
window.EKOADS_GTM={configured:valid,loaded:function(){return loaded;}};
})();