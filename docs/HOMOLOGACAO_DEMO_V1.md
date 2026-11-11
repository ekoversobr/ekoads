# EKOADS — Relatório de homologação da demonstração

**Versão:** 1.0  
**Ambiente:** demonstração pública  
**URL:** https://ekoversobr.github.io/ekoads/demo/  
**Status:** testes funcionais observados; auditoria completa ainda pendente.

> Este relatório registra evidências observadas durante os testes conduzidos no navegador e no GA4. Não representa certificação jurídica, auditoria integral de rede ou validação de um ambiente de cliente.

## 1. Escopo testado

- Carregamento da landing page de demonstração.
- Carregamento do GTM após consentimento analítico afirmativo.
- Recepção de eventos na dataLayer.
- Envio dos eventos observados ao GA4 em tempo real.
- Comportamento observado quando analytics está desmarcado.
- Validação do evento form_start pelo validador local.

## 2. Evidências observadas

### Com analytics autorizado

- O controle de consentimento analítico estava marcado.
- A dataLayer estava disponível.
- O script do GTM foi observado carregado.
- O formulário registrou form_start e marcou o formulário com data-started = "1".
- O validador retornou valid = true e errors = [] para um payload de form_start.
- O relatório em tempo real do GA4 mostrou os eventos:
  - page_view
  - form_start
  - scroll
  - user_engagement
  - click_whatsapp
  - whatsapp_handoff
- Em uma captura do relatório em tempo real, foram observadas 11 ocorrências de form_start, 1 de click_whatsapp e 1 de whatsapp_handoff. Esses números são contagens daquela janela de teste, não resultados comerciais.

### Com analytics recusado

Após recarregar a página e manter analytics desmarcado, foi observado:

- analyticsConsent = false
- dataLayerDisponivel = false
- eventos = []
- gtmCarregado = false
- scriptsGoogle = []

O nome digitado permaneceu no campo do formulário no navegador; esse valor não apareceu na lista de eventos, que permaneceu vazia.

Em um teste posterior, com o consentimento obrigatório de contato marcado e analytics desmarcado, a dataLayer continuou indisponível e a lista de eventos permaneceu vazia.

### Reativação do analytics

Após recarregar a página e marcar o consentimento analítico:

- analyticsConsent = true
- dataLayerDisponivel = true
- gtmCarregado = true
- form_start voltou a ser registrado pelo formulário.

## 3. Interpretação correta dos eventos

- page_view: visualização de página.
- form_start: início de interação com o formulário.
- click_whatsapp: clique no botão/link que inicia o fluxo.
- whatsapp_handoff: tentativa da aplicação de encaminhar o visitante ao WhatsApp.

**click_whatsapp e whatsapp_handoff não comprovam mensagem enviada, conversa recebida, lead recebido, agendamento ou venda.** Esses resultados precisam ser confirmados no processo comercial/CRM.

As contagens do GA4 são observações de uma sessão de testes e não devem ser interpretadas como quantidade de leads.

## 4. Resultado por critério

| Critério | Resultado observado |
|---|---|
| Landing page acessível | Aprovado |
| GTM carregado após consentimento analítico | Aprovado |
| form_start na dataLayer | Aprovado |
| form_start recebido no GA4 em tempo real | Aprovado |
| click_whatsapp recebido no GA4 em tempo real | Aprovado |
| whatsapp_handoff recebido no GA4 em tempo real | Aprovado |
| GTM não carregado com analytics recusado, após recarga | Aprovado |
| dataLayer ausente com analytics recusado, após recarga | Aprovado |
| Reativação do GTM após consentimento afirmativo | Aprovado |
| Ausência de PII nos payloads efetivamente enviados | Parcial — o validador e a lista de eventos foram verificados, mas falta auditoria completa das requisições de rede |
| Retirada de consentimento depois do GTM já carregado | Pendente de teste específico |
| Teste em múltiplos navegadores e dispositivos | Pendente |
| Política de privacidade e base legal revisadas | Pendente |
| Confirmação operacional de lead recebido | Fora do escopo desta landing; pendente de integração/processo comercial |

## 5. Limitações e próximos testes

1. Inspecionar a aba Network do navegador para identificar todas as requisições de terceiros antes e depois do consentimento.
2. Testar a retirada do consentimento na mesma sessão, depois que o GTM já tiver sido carregado; verificar o estado de consentimento e o comportamento de cookies já existentes.
3. Repetir os testes em mobile e em pelo menos outro navegador.
4. Revisar aviso de privacidade, finalidade, retenção, base legal e mecanismo de retirada com responsável competente.
5. Confirmar separadamente a abertura do WhatsApp; não inferir mensagem enviada ou recebida a partir do evento técnico.
6. Manter a configuração, os identificadores e os dados da demonstração isolados de qualquer cliente.

## 6. Segurança e publicação

Este documento não registra número de telefone, credenciais, tokens ou dados pessoais de teste. Identificadores de contas e propriedades devem permanecer em configuração isolada por ambiente e não devem ser copiados para clientes.

A aprovação desta demonstração não autoriza reutilizar suas configurações em produção. Cada cliente exige configuração independente, revisão de privacidade e novo teste de aceite.

## 7. Conclusão

A demonstração EKOADS apresentou funcionamento observado dos eventos de interface testados e do envio desses eventos ao GA4 quando analytics foi autorizado. Nos testes após recarga com analytics recusado, o GTM e a dataLayer não foram carregados.

**Classificação:** homologação funcional parcial aprovada para o escopo descrito. A auditoria de rede, a retirada de consentimento em sessão já iniciada, a revisão jurídica e a validação comercial ponta a ponta permanecem pendentes.
