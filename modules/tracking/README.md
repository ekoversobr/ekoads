# Tracking Intelligence

Módulo de apoio à auditoria manual de GTM, GA4 e conversões do Google Ads.

## Arquivos
- `tracking.html`: checklist interativo e matriz de eventos.
- `tracking.js`: renderização do checklist, status, resumo e exportação CSV.\n- `event-validator.js`: contrato executável para validar eventos da dataLayer, lista permitida de parâmetros e bloqueio básico de campos/valores que aparentem conter PII.

## Uso
Abra `tracking.html` no navegador. Preencha a identificação do ambiente, revise cada controle, marque o status somente após obter evidência e exporte o relatório. A matriz de eventos documenta a diferença entre eventos de interface, leads efetivamente recebidos e resultados comerciais.

## Níveis de evidência
- Clique: interação observada no site.
- Handoff: tentativa de encaminhamento ao canal externo.
- Lead recebido: registro efetivo no canal comercial.
- Lead qualificado: registro que atende critérios comerciais predefinidos.
- Agendamento: compromisso confirmado.
- Comparecimento: presença registrada.
- Venda/receita: transação e recebimento conciliados.

Não inferir um nível a partir do anterior. Um clique no WhatsApp não comprova conversa; um formulário submetido não comprova lead recebido; um lead não comprova qualificação ou venda.

## Roteiro
1. Confirmar IDs, cliente, domínio e ambiente.
2. Verificar consentimento e instalação de tags.
3. Testar eventos no GTM Preview / Tag Assistant.
4. Conferir recepção no GA4 DebugView.
5. Verificar duplicidade, parâmetros e URLs.
6. Reconciliar resultados com registros comerciais.
7. Só então revisar conversões no Google Ads.

## Limitações e segurança
O módulo não se conecta às contas Google, não lê configurações remotas e não valida disparos automaticamente. O status é preenchido por um auditor humano. Não inserir PII, dados clínicos, tokens ou credenciais. Não enviar informações sensíveis para plataformas de publicidade. Qualquer publicação ou alteração em ambiente de cliente exige autorização explícita.
\n## Validador de eventos da landing page\n\nA landing page carrega `event-validator.js` antes de `app.js`. Cada evento é validado antes de entrar na dataLayer. Eventos desconhecidos, parâmetros fora da lista permitida, campos potencialmente pessoais e valores com padrão de e-mail/telefone são rejeitados no navegador e registrados no console. Isso é uma barreira preventiva, não uma garantia de anonimização nem substitui revisão de consentimento, políticas ou testes no Tag Assistant/GA4.\n\nTestes automatizados: `node --test tests/*.test.cjs`.\n