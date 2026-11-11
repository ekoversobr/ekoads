# EKOADS — Relatório de homologação da demonstração

**Versão:** 1.3  
**Ambiente:** demonstração pública  
**URL:** https://ekoversobr.github.io/ekoads/demo/  
**Status:** homologação funcional parcial aprovada; testes de eventos, consentimento e armazenamento documentados dentro do escopo observado.

> Este relatório registra evidências observadas durante testes no navegador, Tag Assistant e GA4. Não representa certificação jurídica, auditoria integral de rede ou validação de ambiente de cliente.

## 1. Escopo testado

- Carregamento da landing page de demonstração.
- Carregamento do GTM após consentimento analítico afirmativo.
- Recepção e envio de eventos ao GA4.
- Validação dos eventos no DebugView.
- Inspeção do corpo visível de requisições `collect`.
- Comportamento com analytics recusado e após retirada do consentimento.
- Inspeção de cookies e armazenamento local.
- Validação do formulário, encaminhamento ao WhatsApp e responsividade em simulação.

## 2. Evidências observadas

### Analytics autorizado e eventos

Com consentimento analítico marcado, foram observados GTM e dataLayer carregados. O GA4 em tempo real e o DebugView receberam:

- `page_view`
- `form_start`
- `click_whatsapp`
- `whatsapp_handoff`
- `scroll`
- `user_engagement`

Na aba Rede do Firefox, foram observadas requisições POST para `www.google-analytics.com/g/collect`, destinadas à propriedade `G-HWHTFQXG08`, com resposta HTTP 204.

Em uma captura da aba Requisição, o corpo visível de uma requisição agrupada apresentou:
- `en=click_whatsapp` com `et=7056`
- `en=whatsapp_handoff` com `et=4`
- `en=form_start` com `et=56`

Os valores de `et` são parâmetros técnicos associados ao evento. A captura não constitui inspeção integral de todos os dados transmitidos em todas as requisições.

### Parâmetros no DebugView

Para `click_whatsapp` e `whatsapp_handoff`, o DebugView exibiu:
- `batch_ordering_id`
- `batch_page_id`
- `debug_mode`
- `ga_session_id`
- `ga_session_number`
- `page_location`
- `page_referrer`
- `page_title`

Nos parâmetros apresentados pelo DebugView não apareceram nome, assunto, telefone ou conteúdo da mensagem preparada para o WhatsApp.

### Inspeção de rede e privacidade

A inspeção identificou o host `www.google-analytics.com`, caminho `/g/collect`, propriedade `G-HWHTFQXG08`, método POST e resposta HTTP 204. Uma requisição analisada apresentou parâmetros automáticos de sessão, página, idioma e dispositivo, além de `pscdl=denied` e `npa=1`.

O arquivo exportado registrou `Content-Length: 75`, mas não continha o corpo POST completo. Em captura separada, o corpo visível do lote mostrou os nomes dos eventos e parâmetros `et`. Não foram vistos parâmetros personalizados de nome, assunto ou telefone nessa captura.

**Limite da evidência:** há evidência favorável de que os campos de contato não foram incluídos nos parâmetros personalizados visíveis dos eventos inspecionados. Não se comprova ausência absoluta de dados pessoais em todas as requisições, cookies, armazenamento, URLs, títulos ou demais comunicações. Os parâmetros `page_location`, `page_referrer` e `page_title` devem permanecer livres de informações pessoais ou sensíveis. `pscdl=denied` e `npa=1`, isoladamente, não certificam conformidade jurídica.

### Formulário e WhatsApp

Foram testadas as validações obrigatórias de nome, assunto e consentimento de contato. Campos ausentes ou consentimento não marcado bloquearam o encaminhamento. Com os campos preenchidos e consentimento marcado, a aplicação abriu o WhatsApp com uma mensagem pré-preenchida.

A abertura do WhatsApp não envia automaticamente a mensagem e não comprova que ela foi enviada, recebida ou respondida.

### Analytics recusado e reativação

Após recarregar com analytics desmarcado, foi observado:
- `analyticsConsent = false`
- `dataLayerDisponivel = false`
- `eventos = []`
- `gtmCarregado = false`
- `scriptsGoogle = []`

Após recarregar e marcar o consentimento analítico, GTM e dataLayer voltaram a estar disponíveis e `form_start` voltou a ser registrado.

### Retirada do consentimento na mesma sessão

Após desmarcar o consentimento depois do carregamento do GTM, não foram identificadas novas requisições `collect` durante aproximadamente um minuto de observação. Requisições anteriores permaneceram no histórico.

**Interpretação limitada:** há evidência funcional de interrupção dos envios posteriores durante o intervalo observado. Isso não comprova remoção de cookies, descarregamento do GTM, ausência de qualquer comunicação futura ou conformidade jurídica.

### Cookies e armazenamento local com analytics recusado

Na inspeção do armazenamento do domínio da demonstração, foram observados os seguintes cookies, mesmo após desmarcar o consentimento analítico e recarregar a página:

- `_ga`
- `_ga_HWHTFQXG08`
- `_gcl_au`

Também foi observada a chave `_gcl_ls` no armazenamento local. O objeto expandido continha a estrutura `gcl`, versão `1`, `gcl_ctr` com valor interno e expiração, além de `gsid_dc.value = null` e `gsid_dc.error = 9`.

Com analytics desmarcado e após recarregar, não foram observadas novas requisições com o filtro `collect`. Em teste separado, também não foram observadas novas requisições com o filtro `gcl`.

**Interpretação limitada:** os cookies e a chave local permaneceram armazenados, mas não foi observada nova requisição `collect` nem nova requisição filtrada por `gcl` no intervalo e cenário testados. A evidência não determina quando esses registros foram originalmente criados, se foram atualizados por mecanismos não observados, nem se todos os identificadores foram removidos ou deixaram de ser lidos. A permanência de armazenamento residual exige avaliação específica antes de qualquer declaração de conformidade. Não foram apagados cookies ou dados locais durante esses testes.

### Teste responsivo

A landing foi inspecionada no Firefox Responsive Design Mode em simulação de 320 × 480 px. Cartão, campos, consentimentos e botão permaneceram utilizáveis, com rolagem vertical e sem corte horizontal aparente. O aviso de privacidade abriu e fechou corretamente. O teste emulado não substitui validação em aparelho físico.

## 3. Interpretação correta dos eventos

- `page_view`: visualização de página.
- `form_start`: início de interação com o formulário.
- `click_whatsapp`: clique no botão/link que inicia o fluxo.
- `whatsapp_handoff`: tentativa da aplicação de encaminhar o visitante ao WhatsApp.

**`click_whatsapp` e `whatsapp_handoff` não comprovam mensagem enviada, conversa recebida, lead recebido, agendamento ou venda.** Esses resultados precisam ser confirmados no processo comercial/CRM. Contagens de sessões de teste não são quantidade de leads.

## 4. Resultado por critério

| Critério | Resultado observado |
|---|---|
| Landing acessível | Aprovado |
| GTM carregado após consentimento analítico | Aprovado |
| Eventos recebidos em tempo real e DebugView | Aprovado |
| Requisições POST para GA4 com resposta 204 | Aprovado |
| Corpo visível do lote com os três eventos inspecionados | Aprovado no escopo da captura |
| Nome, assunto e telefone ausentes dos parâmetros personalizados visíveis | Aprovado no escopo inspecionado; não é auditoria integral |
| GTM/dataLayer ausentes após recarga com analytics recusado | Aprovado |
| Reativação após consentimento afirmativo | Aprovado |
| Retirada de consentimento na mesma sessão | Parcial — sem novos `collect` observados por aproximadamente um minuto |
| Cookies e `_gcl_ls` permanecem após recarga com analytics recusado | Observado; requer avaliação |
| Novas requisições `collect` e `gcl` após recarga com analytics recusado | Nenhuma observada no cenário testado |
| Teste responsivo em navegador | Aprovado em simulação 320 × 480 px |
| Auditoria integral de rede, cookies e armazenamento | Pendente |
| Teste em aparelho físico e múltiplos navegadores | Pendente |
| Revisão jurídica de aviso, finalidade, retenção e base legal | Pendente |
| Confirmação operacional de lead recebido | Fora do escopo da landing; pendente de processo comercial/CRM |

## 5. Pendências

1. Determinar a origem e o ciclo de vida dos cookies `_ga`, `_ga_HWHTFQXG08`, `_gcl_au` e da chave `_gcl_ls`, inclusive se são criados antes ou depois do consentimento.
2. Avaliar tecnicamente o tratamento de identificadores residuais após retirada/recusa, sem apagar dados antes de definir o comportamento esperado.
3. Completar auditoria de rede, cookies e armazenamento, incluindo todas as requisições e parâmetros automáticos.
4. Repetir testes em aparelho físico e outro navegador.
5. Revisar aviso de privacidade, finalidade, retenção, base legal e mecanismo de retirada com responsável competente.
6. Confirmar recebimento de contatos no processo comercial, sem inferir lead a partir de clique ou handoff.
7. Manter identificadores, configurações e dados da demonstração isolados de qualquer cliente.

## 6. Segurança e publicação

Este documento não registra nome, telefone, conteúdo da mensagem, credenciais ou tokens de teste. Identificadores de contas e propriedades devem permanecer isolados por ambiente e não devem ser copiados para clientes.

A aprovação desta demonstração não autoriza reutilizar suas configurações em produção. Cada cliente exige configuração independente, revisão de privacidade e novo teste de aceite.

## 7. Conclusão

A demonstração EKOADS apresentou funcionamento observado dos eventos de interface e envio ao GA4 com analytics autorizado. Os eventos `click_whatsapp` e `whatsapp_handoff` foram recebidos no DebugView. Na inspeção de rede realizada, o corpo visível de um lote apresentou os nomes desses eventos e `form_start`, sem parâmetros personalizados de nome, assunto ou telefone na captura.

Com analytics recusado e após recarga, não foram observadas novas requisições `collect` ou filtradas por `gcl` nos cenários testados. Entretanto, cookies `_ga`, `_ga_HWHTFQXG08`, `_gcl_au` e a chave local `_gcl_ls` permaneceram armazenados. A origem, o ciclo de vida e o tratamento desses identificadores residuais continuam pendentes de avaliação.

**Classificação:** homologação funcional parcial aprovada para o escopo descrito. A auditoria integral de rede e armazenamento, avaliação dos identificadores residuais, testes em aparelho físico e múltiplos navegadores, revisão jurídica e validação comercial ponta a ponta permanecem pendentes.
