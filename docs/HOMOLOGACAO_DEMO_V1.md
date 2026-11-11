# EKOADS — Relatório de homologação da demonstração

**Versão:** 1.1  
**Ambiente:** demonstração pública  
**URL:** https://ekoversobr.github.io/ekoads/demo/  
**Status:** homologação funcional parcial aprovada; validação técnica de eventos e parâmetros no DebugView concluída para os eventos observados.

> Este relatório registra evidências observadas durante os testes conduzidos no navegador, no Tag Assistant e no GA4. Não representa certificação jurídica, auditoria integral de rede ou validação de um ambiente de cliente.

## 1. Escopo testado

- Carregamento da landing page de demonstração.
- Carregamento do GTM após consentimento analítico afirmativo.
- Recepção de eventos na dataLayer.
- Envio dos eventos observados ao GA4 em tempo real.
- Validação dos eventos no DebugView com dispositivo em modo de depuração.
- Inspeção dos parâmetros apresentados pelo DebugView para `click_whatsapp` e `whatsapp_handoff`.
- Comportamento observado quando analytics está desmarcado.
- Validação do formulário e do fluxo de encaminhamento ao WhatsApp.

## 2. Evidências observadas

### Com analytics autorizado

- O controle de consentimento analítico estava marcado.
- A dataLayer estava disponível.
- O script do GTM foi observado carregado.
- O formulário registrou `form_start`.
- O relatório em tempo real do GA4 mostrou os eventos:
  - `page_view`
  - `form_start`
  - `scroll`
  - `user_engagement`
  - `click_whatsapp`
  - `whatsapp_handoff`

### DebugView e parâmetros dos eventos

Com o dispositivo em modo de depuração, o DebugView recebeu os seguintes eventos durante a sessão observada:

- `page_view`
- `form_start`
- `click_whatsapp`
- `whatsapp_handoff`

Foram inspecionados os parâmetros exibidos para `click_whatsapp` e `whatsapp_handoff`. Em ambos apareceram:

- `batch_ordering_id`
- `batch_page_id`
- `debug_mode`
- `ga_session_id`
- `ga_session_number`
- `page_location`
- `page_referrer`
- `page_title`

Nos parâmetros apresentados pelo DebugView não apareceram nome, assunto, telefone ou conteúdo da mensagem preparada para o WhatsApp.

**Limite da evidência:** a inspeção dos parâmetros no DebugView não substitui uma auditoria completa das requisições de rede, cookies, armazenamento local e demais dados automáticos. Os parâmetros `page_location`, `page_referrer` e `page_title` devem permanecer livres de informações pessoais ou sensíveis.

### Formulário e encaminhamento ao WhatsApp

Foram testadas as validações obrigatórias de nome, assunto e consentimento de contato. Os campos ausentes ou o consentimento não marcado bloquearam o encaminhamento. Com os campos preenchidos e consentimento marcado, a aplicação abriu o WhatsApp com uma mensagem pré-preenchida.

A abertura do WhatsApp não envia automaticamente a mensagem e não comprova que ela foi enviada, recebida ou respondida.

### Com analytics recusado

Após recarregar a página e manter analytics desmarcado, foi observado:

- `analyticsConsent = false`
- `dataLayerDisponivel = false`
- `eventos = []`
- `gtmCarregado = false`
- `scriptsGoogle = []`

O nome digitado permaneceu no campo do formulário no navegador; esse valor não apareceu na lista de eventos, que permaneceu vazia.

Em um teste posterior, com o consentimento obrigatório de contato marcado e analytics desmarcado, a dataLayer continuou indisponível e a lista de eventos permaneceu vazia.

### Reativação do analytics

Após recarregar a página e marcar o consentimento analítico:

- `analyticsConsent = true`
- `dataLayerDisponivel = true`
- `gtmCarregado = true`
- `form_start` voltou a ser registrado pelo formulário.

### Retirada do consentimento na mesma sessão

Foi observado um teste de retirada do consentimento depois do carregamento do GTM. Após desmarcar o controle, não foram identificadas novas requisições `collect` durante aproximadamente um minuto de observação. Requisições anteriores continuaram visíveis no histórico da aba Rede.

**Interpretação limitada:** há evidência funcional de interrupção dos envios posteriores durante o intervalo observado. Isso não comprova remoção de cookies, descarregamento do GTM, ausência de qualquer comunicação futura ou conformidade jurídica.

### Teste responsivo

A landing foi inspecionada no Firefox Responsive Design Mode em simulação de 320 × 480 px. Cartão, campos, consentimentos e botão permaneceram utilizáveis, com rolagem vertical e sem corte horizontal aparente. O aviso de privacidade abriu e fechou corretamente.

Esse teste emulado não substitui validação em aparelho físico.

## 3. Interpretação correta dos eventos

- `page_view`: visualização de página.
- `form_start`: início de interação com o formulário.
- `click_whatsapp`: clique no botão/link que inicia o fluxo.
- `whatsapp_handoff`: tentativa da aplicação de encaminhar o visitante ao WhatsApp.

**`click_whatsapp` e `whatsapp_handoff` não comprovam mensagem enviada, conversa recebida, lead recebido, agendamento ou venda.** Esses resultados precisam ser confirmados no processo comercial/CRM.

As contagens do GA4 são observações de sessões de teste e não devem ser interpretadas como quantidade de leads.

## 4. Resultado por critério

| Critério | Resultado observado |
|---|---|
| Landing page acessível | Aprovado |
| GTM carregado após consentimento analítico | Aprovado |
| `form_start` recebido no GA4 em tempo real | Aprovado |
| `click_whatsapp` recebido no GA4 em tempo real | Aprovado |
| `whatsapp_handoff` recebido no GA4 em tempo real | Aprovado |
| Eventos observados no DebugView com modo de depuração | Aprovado |
| Parâmetros de `click_whatsapp` e `whatsapp_handoff` inspecionados | Aprovado no escopo observado |
| Nome, assunto, telefone e conteúdo da mensagem ausentes dos parâmetros exibidos | Aprovado no escopo observado |
| GTM não carregado com analytics recusado, após recarga | Aprovado |
| dataLayer ausente com analytics recusado, após recarga | Aprovado |
| Reativação do GTM após consentimento afirmativo | Aprovado |
| Retirada de consentimento na mesma sessão | Parcial — sem novos `collect` observados por aproximadamente um minuto; auditoria ampliada pendente |
| Teste responsivo em navegador | Aprovado em simulação 320 × 480 px |
| Teste em aparelho físico e múltiplos navegadores | Pendente |
| Auditoria completa de rede, cookies e armazenamento | Pendente |
| Revisão jurídica de aviso, finalidade, retenção e base legal | Pendente |
| Confirmação operacional de lead recebido | Fora do escopo desta landing; pendente de integração/processo comercial |

## 5. Limitações e próximos testes

1. Completar a auditoria de rede, cookies e armazenamento, inclusive verificando se URLs e títulos contêm dados pessoais.
2. Ampliar o teste de retirada do consentimento em sessão já iniciada e avaliar cookies/armazenamento existentes.
3. Repetir os testes em aparelho físico e em outro navegador.
4. Revisar aviso de privacidade, finalidade, retenção, base legal e mecanismo de retirada com responsável competente.
5. Confirmar separadamente o recebimento de contatos no processo comercial; não inferir lead recebido a partir do evento técnico.
6. Manter a configuração, os identificadores e os dados da demonstração isolados de qualquer cliente.

## 6. Segurança e publicação

Este documento não registra nome, telefone, conteúdo de mensagem, credenciais ou tokens de teste. Identificadores de contas e propriedades devem permanecer em configuração isolada por ambiente e não devem ser copiados para clientes.

A aprovação desta demonstração não autoriza reutilizar suas configurações em produção. Cada cliente exige configuração independente, revisão de privacidade e novo teste de aceite.

## 7. Conclusão

A demonstração EKOADS apresentou funcionamento observado dos eventos de interface testados e do envio desses eventos ao GA4 quando analytics foi autorizado. Os eventos `click_whatsapp` e `whatsapp_handoff` também foram recebidos no DebugView, e os parâmetros inspecionados não exibiram nome, assunto, telefone ou conteúdo da mensagem.

Nos testes após recarga com analytics recusado, o GTM e a dataLayer não foram carregados. Na retirada do consentimento durante uma sessão já iniciada, não foram observados novos envios `collect` durante aproximadamente um minuto, dentro do limite desse teste.

**Classificação:** homologação funcional parcial aprovada para o escopo descrito. A auditoria completa de rede e armazenamento, os testes em aparelho físico e múltiplos navegadores, a revisão jurídica e a validação comercial ponta a ponta permanecem pendentes.
