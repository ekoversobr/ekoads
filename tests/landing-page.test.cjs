const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const app=fs.readFileSync("modules/landing-pages/app.js","utf8");
const html=fs.readFileSync("modules/landing-pages/index.html","utf8");
const config=fs.readFileSync("modules/landing-pages/config.js","utf8");
test("preserva somente UTMs permitidas e limita tamanho",()=>{for(const k of ["utm_source","utm_medium","utm_campaign","utm_content","utm_term"])assert.ok(app.includes('"'+k+'"'));assert.match(app,/v\.length<=120/);});
test("não inclui nome ou telefone em eventos ou mensagem do WhatsApp",()=>{assert.doesNotMatch(app,/first-name|firstName|telefone|phone/i);assert.match(app,/Olá! Gostaria de receber informações/);});
test("separa início de formulário, clique WhatsApp e handoff",()=>{for(const e of ["form_start","click_whatsapp","whatsapp_handoff"])assert.ok(app.includes('"'+e+'"'));assert.ok(html.includes('data-track="hero_cta_click"'));});
test("exige consentimento e bloqueia WhatsApp placeholder",()=>{assert.match(app,/if\(!consent\.checked\)/);assert.match(app,/5500000000000/);});
test("HTML não coleta nome e informa aviso de privacidade",()=>{assert.doesNotMatch(html,/id="first-name"|name="firstName"/);assert.match(html,/privacy-link/);assert.match(html,/consent/);});
test("configuração usa placeholder e identificador genérico",()=>{assert.match(config,/SUA MARCA/);assert.match(config,/servico-exemplo/);});

const loader=fs.readFileSync("modules/landing-pages/gtm-loader.js","utf8");
test("GTM fica desativado sem ID válido e depende de consentimento analítico",()=>{
 assert.match(config,/gtmId: ""/);
 assert.match(loader,/\^GTM-\[A-Z0-9\]\+\$/);
 assert.match(loader,/checkbox\.addEventListener\("change"/);
 assert.match(html,/id="analytics-consent"/);
});
test("Consent Mode nega armazenamento por padrão e só libera analytics após escolha",()=>{
 assert.match(loader,/ad_storage:"denied"/);
 assert.match(loader,/analytics_storage:"denied"/);
 assert.match(loader,/analytics_storage:"granted"/);
 assert.match(loader,/ad_user_data:"denied"/);
 assert.match(loader,/ad_personalization:"denied"/);
});
test("GTM é carregado uma única vez por sessão da página",()=>{
 assert.match(loader,/if\(loaded\|\|!valid\)return/);
 assert.match(loader,/googletagmanager\.com\/gtm\.js/);
});

test("não envia nem acumula eventos antes do consentimento analítico",()=>{
 assert.match(app,/if\(!analyticsConsent\|\|!analyticsConsent\.checked\)return/);
 assert.ok(app.indexOf("if(!analyticsConsent||!analyticsConsent.checked)return")<app.indexOf("window.dataLayer.push(payload)"));
});
