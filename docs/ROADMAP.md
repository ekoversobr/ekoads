# EKOADS — Roadmap

Roadmap incremental. Uma fase só avança depois de validar a anterior.

## Fase 0 — Fundação
- [x] Criar repositório independente `ekoads`.
- [x] Definir README inicial.
- [x] Registrar princípios e arquitetura preliminar.
- [ ] Revisar estrutura e decisões técnicas com o responsável pelo projeto.

## Fase 1 — Primeiro módulo: Google Ads
- [ ] Definir escopo funcional do módulo.
- [ ] Criar checklist de auditoria de conta e campanha.
- [ ] Criar modelo de coleta de dados e diagnóstico.
- [ ] Definir métricas, fórmulas e critérios de decisão.
- [ ] Criar documentação de otimização e experimentação.

## Fase 2 — Tracking
- [x] Especificar eventos e parâmetros de referência.
- [x] Criar checklist manual de auditoria GTM/GA4.
- [x] Definir distinção entre microeventos, leads e resultados comerciais.
- [x] Documentar roteiro de testes com Preview, Tag Assistant e DebugView.
- [x] Incluir controles de deduplicação, privacidade e validação comercial.
- [ ] Executar testes funcionais do checklist em navegador e validar com ambiente de demonstração.

## Fase 3 — Landing Pages
- [x] Definir requisitos iniciais de desempenho, acessibilidade e responsividade.
- [x] Criar estrutura-base independente de clientes.
- [x] Implementar formulário mínimo com validação local.
- [x] Implementar handoff para WhatsApp e distinguir tentativa de abertura de contato recebido.
- [x] Preparar eventos no dataLayer sem dados pessoais.
- [ ] Testar em dispositivos reais, configurar consentimento e validar GTM/GA4 em ambiente de teste.

## Fase 4 — Integrações e operação comercial
- [x] Definir modelo mínimo de registro operacional sem dados pessoais.
- [x] Criar protótipo local para acompanhar estado do funil.
- [x] Definir estados de lead recebido, qualificado, agendado, comparecimento, venda e perdido.
- [x] Criar importação e exportação CSV.
- [ ] Projetar backend seguro, autenticação, isolamento multi-cliente e trilha histórica.
- [ ] Integrar formulários e canais comerciais por conectores autorizados.
- [ ] Avaliar CRM e automações após requisitos de segurança.

## Fase 5 — Analytics e inteligência econômica
- [ ] Criar painel de mídia e funil.
- [ ] Calcular CPL, CPQL, CPA de agendamento, CAC, ROAS e ROI.
- [ ] Distinguir receita atribuída, recebida, margem e lucro.
- [ ] Definir relatórios e periodicidade.

## Regras de execução

- Uma entrega por vez, com teste e validação.
- Não alterar campanhas, contas, tags ou sites de clientes sem autorização explícita.
- Não misturar dados entre Eko Clínica, Eko Dental ou outros clientes.
- Não declarar sucesso com amostras pequenas ou rastreamento não validado.
- Registrar decisões, limitações e mudanças relevantes.
