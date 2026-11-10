const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const base = "modules/landing-pages-demo/";
const config = fs.readFileSync(base + "config.js", "utf8");
const app = fs.readFileSync(base + "app.js", "utf8");
const html = fs.readFileSync(base + "index.html", "utf8");

test("ambiente de homologação usa marca Eko Verso e modo demo", () => {
  assert.match(config, /brandName: "EKO VERSO"/);
  assert.match(config, /demoMode: true/);
});

test("usa o WhatsApp autorizado apenas na demonstração e mantém GTM vazio", () => {
  assert.match(config, /whatsappNumber: "5583996224306"/);
  assert.match(config, /gtmId: ""/);
});

test("demo abre WhatsApp com mensagem preparada, sem envio automático", () => {
  assert.match(app, /if\(cfg\.demoMode\)/);
  assert.match(app, /https:\/\/wa\.me\//);
  assert.match(app, /Nenhuma mensagem será enviada automaticamente/);
  assert.match(app, /window\.open\(testUrl/);
});

test("HTML identifica ambiente de testes e não solicita dados pessoais", () => {
  assert.match(html, /EKO VERSO · AMBIENTE DE TESTES/);
  assert.match(html, /Abrir WhatsApp de teste/);
  assert.doesNotMatch(html, /name="firstName"|id="first-name"/);
});
