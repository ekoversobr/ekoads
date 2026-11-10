# Landing Pages — Modelo base

Modelo estático responsivo de landing page para replicação por serviço/cliente.

## Arquivos
- `index.html`: estrutura semântica da página e formulário mínimo.
- `styles.css`: layout responsivo e componentes visuais.
- `config.js`: configurações públicas específicas da página, incluindo o ID opcional do GTM.
- `gtm-loader.js`: carrega o container somente após consentimento opcional de análise.
- `app.js`: validação do formulário, aviso de privacidade e eventos não identificáveis.

## Configuração
1. Copie a pasta para o projeto/página do cliente sem compartilhar IDs ou configurações entre clientes.
2. Edite `config.js`: nome público da marca, número oficial do WhatsApp em formato internacional (somente dígitos), URL do aviso de privacidade e identificador genérico da página.
3. Edite os textos e substitua os benefícios por informações verdadeiras e verificáveis.
4. Atualize links, identidade visual e conteúdo.
5. Teste em desktop e celular antes de publicar.

O número de WhatsApp de exemplo não funciona. Não publique sem substituí-lo.

## Formulário e WhatsApp
O formulário pede consentimento para iniciar contato, sem coletar nome ou outros dados pessoais. Não há backend nem armazenamento de leads. Ao validar, abre o WhatsApp com uma mensagem genérica. A pessoa ainda precisa revisar e enviar a mensagem. UTMs permitidas são preservadas em sessionStorage e incluídas nos eventos da dataLayer; não são prova de lead recebido.

Eventos canônicos emitidos: `hero_cta_click`, `form_start`, `click_whatsapp` (para links wa.me) e `whatsapp_handoff`. O handoff registra a tentativa de encaminhamento, não a abertura confirmada, mensagem enviada ou conversa recebida. Nenhum dos dois prova mensagem enviada, conversa recebida, lead qualificado ou venda.

## Mensuração
Os eventos são enviados ao `dataLayer` sem nome, telefone, e-mail ou conteúdo digitado. O GTM pode ser configurado em `config.js` com `gtmId: "GTM-XXXXXXX"`. O container só é carregado após a pessoa marcar o consentimento opcional de análise. Sem ID válido ou sem consentimento, o GTM permanece desativado. O loader aplica Consent Mode com armazenamento de anúncios e analytics negado por padrão, concedendo somente `analytics_storage` após a escolha. Revise a implementação e a política de consentimento do cliente antes de publicar. O GA4 e as tags do Google Ads ainda precisam ser configurados dentro do container. Não envie dados pessoais ou sensíveis para Google Ads, GA4 ou URLs.

## Segurança e privacidade
- Não inclua sintomas, diagnósticos, tratamentos ou outras informações sensíveis no formulário, URL ou eventos.
- O WhatsApp é serviço externo, sujeito às próprias políticas.
- Configure aviso de privacidade real e adequado ao negócio.
- O modelo não implementa CRM, persistência, backend, consent management platform nem validação server-side.
- Não é apropriado para coleta de informações clínicas.
- Nenhuma campanha, tag ou site de cliente é alterado por este módulo.

## Checklist antes da publicação
- [ ] WhatsApp oficial configurado e testado.
- [ ] Marca, textos e benefícios revisados.
- [ ] Aviso de privacidade publicado.
- [ ] Consentimento revisado para o contexto.
- [ ] Layout testado em celular e desktop.
- [ ] Links e formulário testados.
- [ ] GTM/GA4 configurados e validados em ambiente de teste.
- [ ] Eventos sem PII e sem dados sensíveis.
- [ ] Aprovação do responsável pelo cliente.
