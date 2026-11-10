# Padrão do template — rastreamento ponta a ponta

## Objetivo

Este documento define o contrato reutilizável do template EKOADS. Cada cliente recebe uma cópia/configuração independente. O repositório-base não deve conter IDs, números, domínios, propriedades ou credenciais de clientes reais.

## Fluxo comercial que precisa ser comprovado

1. **Anúncio / Google Ads** — impressão, clique, campanha, grupo, palavra-chave/termo e identificadores de clique quando disponíveis.
2. **Landing page** — carregamento da página e leitura de UTMs/parâmetros permitidos.
3. **Interação** — clique no CTA e início de formulário.
4. **Handoff WhatsApp** — tentativa de abrir o WhatsApp. É intenção, não prova de mensagem enviada.
5. **Conversa recebida** — confirmação operacional no WhatsApp/CRM. Não pode ser inferida do clique.
6. **Lead recebido** — registro comercial com referência aleatória e origem preservada.
7. **Lead qualificado** — critérios comerciais definidos e aplicados pela equipe.
8. **Agendamento** — compromisso confirmado.
9. **Comparecimento** — presença confirmada.
10. **Venda** — venda efetivada.
11. **Receita recebida** — valor conciliado financeiramente.

Não colapsar essas etapas em uma única conversão. Clique, handoff, lead, qualificação, agendamento, comparecimento, venda e recebimento são eventos diferentes.

## Contrato de eventos recomendado

| Evento | Quando dispara | Destino/uso recomendado | Conversão primária? |
|---|---|---|---|
| `page_view` | Página visualizada | GA4 via GTM | Não |
| `view_service` | Conteúdo do serviço visualizado | GA4 via GTM | Não |
| `click_whatsapp` | Clique explícito em link/botão WhatsApp | GA4 via GTM | Não |
| `form_start` | Primeira interação com formulário | GA4 via GTM | Não |
| `form_submit` | Submissão aceita pelo sistema receptor | GA4 via GTM | Não, até validar recebimento |
| `whatsapp_handoff` | Navegador tenta abrir o WhatsApp | GA4 via GTM | Não |
| `lead_received` | Contato confirmado no processo comercial | CRM/servidor; importação offline quando elegível | Candidata |
| `qualified_lead` | Critério comercial de qualificação atingido | CRM; conversão offline quando elegível | Sim, se for o objetivo |
| `appointment_scheduled` | Agendamento confirmado | CRM; conversão offline quando elegível | Sim, se for o objetivo |
| `appointment_attended` | Comparecimento confirmado | CRM/relatório | Resultado offline |
| `purchase` | Venda efetivada | CRM/financeiro | Sim, conforme modelo |
| `revenue_received` | Recebimento conciliado | Financeiro/analytics agregado | Resultado financeiro |

Os nomes são o padrão canônico do template. O evento de interface nunca deve alegar que uma etapa posterior aconteceu.

## Parâmetros permitidos

- `page_id`: identificador genérico da página/serviço, sem nome de paciente ou condição de saúde.
- `client_key`: identificador técnico não pessoal, configurado por ambiente, se necessário.
- UTMs: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, com valores não sensíveis.
- Identificadores de clique de anúncios, quando necessários e tratados conforme consentimento e políticas aplicáveis.

Não enviar a dataLayer, GA4 ou Google Ads: nome, telefone, e-mail, conteúdo de conversa, sintomas, diagnóstico, especialidade ligada a condição de saúde, prontuário ou qualquer dado sensível. Não colocar PII em URLs, query strings, nomes de eventos ou parâmetros.

## Responsabilidades por componente

- **Landing page:** apresenta a oferta, captura UTMs permitidas, gera eventos de interface e encaminha o usuário ao canal.
- **Google Tag Manager (GTM):** recebe eventos da dataLayer, aplica consentimento, roteia tags GA4/Google Ads e evita duplicidade.
- **GA4:** mede navegação e microconversões; não substitui o CRM nem comprova etapas comerciais.
- **Google Ads:** recebe apenas conversões definidas e validadas; microconversões não devem ser automaticamente usadas como objetivo primário de lances.
- **WhatsApp:** canal de atendimento. Um link `wa.me` não permite confirmar que a conversa foi iniciada/recebida.
- **CRM/Lead Operations:** mantém referência pseudônima, origem, canal e etapas comerciais; idealmente com histórico de transições e controle de acesso.
- **Dashboard:** combina investimento de mídia com etapas comerciais e receita conciliada, respeitando período, origem e atribuição.

## Configuração por cliente

Cada cópia do template deve configurar separadamente:
- nome da marca, domínio, página/serviço e número oficial do WhatsApp;
- URL pública do aviso de privacidade;
- container GTM do cliente;
- propriedade GA4 vinculada ao GTM;
- conta/conversões Google Ads do cliente;
- consentimento/cookies e região aplicável;
- UTMs e convenção de nomenclatura;
- processo de recepção/qualificação e sistema comercial.

Não inserir esses IDs no template público compartilhado. Usar arquivo de configuração por implantação e revisar antes de publicar. Nunca versionar credenciais, tokens ou dados pessoais.

## Critérios de aceite ponta a ponta

Uma implantação só pode ser marcada como validada quando houver evidência para cada camada:

1. URL publicada em HTTPS e versão mobile testada.
2. UTMs preservadas da URL de entrada até o registro comercial, sem PII.
3. GTM correto para o cliente, carregado uma vez e com consentimento verificado.
4. GA4 correto recebendo eventos no DebugView; sem duplicidade.
5. Eventos de clique/handoff diferenciados de lead recebido.
6. WhatsApp oficial correto; teste controlado confirma abertura e mensagem revisada pelo usuário.
7. Lead de teste aparece no processo comercial com referência e origem.
8. Qualificação, agendamento, comparecimento e venda são registrados separadamente.
9. Conversões Google Ads são definidas como primárias/secundárias conforme objetivo, com teste de atribuição e deduplicação.
10. Receita é conciliada com a fonte financeira; não confundir valor estimado com recebido.
11. Relatório/dashboards usam o mesmo período, fuso, escopo e regras de atribuição.
12. Consentimento, privacidade, retenção e permissões revisados.

Guardar evidências técnicas sem PII: capturas redigidas, nomes de eventos, horários, IDs técnicos parcialmente mascarados e referência de teste aleatória.

## Auditoria do estado atual do template-base

**Confirmado por inspeção do código no repositório:**
- Landing page estática e responsiva, com formulário mínimo e redirecionamento para `wa.me`.
- Número e marca são placeholders em `modules/landing-pages/config.js`.
- Há eventos locais na dataLayer: `hero_cta_click`, `contact_form_validated` e `whatsapp_handoff_attempt`.
- O formulário exige consentimento para iniciar contato e informa que não deve receber dados clínicos.
- Não há integração/backend para confirmar recebimento do lead.
- Tracking Intelligence é checklist manual; não se conecta ao GTM, GA4 ou Google Ads.
- Lead Operations armazena dados operacionais no localStorage; não é CRM e não sincroniza.
- Dashboard importa CSV comercial, mas não importa custos de mídia segmentados por origem.
- O template-base não contém configuração nem carregador de GTM; portanto não é possível afirmar que tags, GA4 ou Google Ads estejam instalados.

**Pendências identificadas antes de declarar o fluxo validado:**
- Os nomes de eventos atuais da landing page não correspondem ao contrato canônico acima.
- O primeiro nome é inserido no texto da URL do WhatsApp. Isso pode expor dado pessoal em histórico, logs ou ferramentas de medição; preferir mensagem genérica sem nome.
- O evento `contact_form_validated` indica validação no navegador, não envio/recebimento de lead.
- O template não possui persistência de UTMs/origem até o registro comercial.
- GTM, GA4, Google Ads, consentimento e recebimento de lead não estão conectados/validados por este repositório.
- Lead Operations ainda não oferece histórico de transições; registra somente estado atual.
- O localStorage não oferece isolamento seguro entre usuários/clientes nem backup.

**Conclusão:** o template tem a interface de entrada e um protótipo local de operação comercial, mas o caminho completo anúncio → receita ainda não está integrado nem comprovado. Não publicar para cliente como rastreamento ponta a ponta validado até cumprir os critérios de aceite.
