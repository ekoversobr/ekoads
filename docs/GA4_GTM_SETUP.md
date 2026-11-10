# Configuração GA4 pelo Google Tag Manager — template EKOADS

## Princípio

O template mestre carrega somente o container GTM configurado na implantação do cliente, após a escolha afirmativa do controle opcional de análise. O ID da propriedade GA4 **não deve ser inserido no repositório mestre**: configure-o como variável/tag dentro do container GTM próprio do cliente.

Este documento é um roteiro técnico. Não comprova que um container, propriedade ou evento real esteja instalado. A validação exige acesso ao ambiente do cliente e evidência no Tag Assistant e GA4 DebugView.

## Pré-requisitos por cliente

- Container GTM criado para o domínio correto.
- Propriedade GA4 criada e fluxo Web configurado.
- ID do container GTM preenchido em `modules/landing-pages/config.js` na cópia privada/implantação.
- Política de privacidade, consentimento e retenção revisados para o contexto e jurisdição.
- Nenhum ID, token ou dado pessoal incluído no template público.

## Tags e acionadores no GTM

1. Criar uma tag **Google tag** com o ID de medição da propriedade GA4 do cliente.
2. Configurar o disparo para inicialização após o consentimento aplicável; respeitar os estados do Consent Mode enviados pelo loader.
3. Habilitar page_view automático uma única vez na Google tag. Não criar outro acionador page_view que duplique o envio.
4. Criar uma tag **GA4 Event** para cada evento abaixo, usando o nome do evento exatamente como aparece na dataLayer.
5. Usar acionador **Custom Event** com correspondência exata.
6. Mapear parâmetros permitidos: `page_id`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`.
7. Não mapear parâmetros pessoais, texto digitado, telefone, e-mail, conteúdo de WhatsApp, sintomas, diagnósticos ou qualquer dado sensível.
8. Publicar somente após Preview/Tag Assistant e aprovação do responsável pelo cliente.

## Eventos emitidos pelo template

| Evento dataLayer | Acionador GTM | Interpretação | Evento-chave GA4? |
|---|---|---|---|
| `hero_cta_click` | Custom Event exato | Clique no CTA principal | Não |
| `form_start` | Custom Event exato | Primeira interação no formulário | Não |
| `click_whatsapp` | Custom Event exato | Clique em link explícito wa.me, se houver | Não |
| `whatsapp_handoff` | Custom Event exato | Tentativa de abrir o WhatsApp após validação | Não |

O HTML atual não contém link `wa.me` estático; portanto `click_whatsapp` só será enviado se um link desse tipo for adicionado à página. O botão de envio do formulário emite `whatsapp_handoff`.

O evento `whatsapp_handoff` não comprova abertura do aplicativo, mensagem enviada ou conversa recebida. Nenhum evento de lead, qualificação, agendamento ou venda é emitido pela landing page atual.

## Conversões e otimização

- Não marcar cliques, início de formulário ou handoff como conversão primária de negócio por padrão.
- GA4 mede comportamento digital; CRM/atendimento confirma lead recebido e etapas posteriores.
- Eventos comerciais posteriores devem vir de sistema operacional confiável, com consentimento, base legal, minimização e controles de acesso apropriados.
- Só importar conversões para Google Ads depois de validar definição, origem, deduplicação, janela, atribuição e qualidade dos dados.
- Não enviar informação de saúde ou dados sensíveis para GA4/Google Ads. Para negócios de saúde, revisar também políticas específicas das plataformas e evitar parâmetros que revelem condição ou interesse sensível.

## Teste de aceite

1. Abrir a landing page em janela limpa com consentimento analítico desmarcado.
2. Confirmar que o container GTM não é carregado e que não há hits GA4 de analytics.
3. Marcar o consentimento opcional; confirmar o carregamento do container correto uma única vez.
4. No Tag Assistant, confirmar o estado de consentimento e a tag Google/GA4.
5. No GA4 DebugView, verificar um único page_view e os eventos de interação acionados.
6. Testar cada evento separadamente; confirmar parâmetros de campanha sem PII.
7. Desmarcar consentimento e confirmar atualização para denied; documentar limitações de cookies já gravados e política de retirada.
8. Repetir em mobile e desktop, com UTMs de teste.
9. Guardar evidência redigida, sem IDs completos ou dados pessoais.

## Limitações atuais

- O EKOADS não provisiona propriedades GA4 nem configura tags dentro do GTM.
- O repositório não acessa Tag Assistant, GA4 DebugView ou contas de clientes.
- O consentimento apresentado é um controle técnico básico, não uma CMP nem parecer jurídico.
- A escolha de analytics não substitui consentimento/base legal eventualmente exigidos para outras finalidades e tecnologias.
- A retirada do consentimento atualiza o estado para denied, mas não apaga automaticamente dados já enviados ou cookies existentes.
- Não há medição de conversa recebida, lead qualificado, agendamento, comparecimento, venda ou receita nesta landing page.

## Status

**Preparação técnica documentada; integração GA4 real pendente de configuração e teste em container/propriedade de cliente.**
