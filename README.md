# EKOADS

Plataforma modular da Eko Verso Digital para planejamento, execução e análise de aquisição de clientes.

O EKOADS nasce em um repositório independente, do zero. Não utiliza nem copia a estrutura do antigo `ekoversotemplatesite`.

## Objetivo

Construir uma base técnica e operacional para:
- Planejar e otimizar campanhas de Google Ads.
- Criar landing pages orientadas à conversão.
- Implementar mensuração com Google Tag Manager (GTM) e Google Analytics 4 (GA4).
- Integrar formulários, WhatsApp e processos comerciais.
- Analisar leads qualificados, agendamentos, vendas e rentabilidade.

## Princípios

1. Resultados comerciais acima de métricas de vaidade.
2. Um cliente, um ambiente de dados e configurações independentes.
3. Eventos e conversões com significado verificável.
4. Privacidade, segurança e conformidade com a LGPD.
5. Arquitetura modular, documentada e evolutiva.
6. Implementações pequenas, testadas e reversíveis.

## Módulos planejados

| Módulo | Responsabilidade |
|---|---|
| Google Ads | Estratégia, estrutura, palavras-chave e otimização |
| Landing Pages | Páginas rápidas, responsivas e focadas em ação |
| Tracking | GTM, GA4, eventos e conversões |
| Integrações | Formulários, WhatsApp, planilhas e CRM |
| Analytics | Indicadores, análise estatística e econômica |
| Documentação | Padrões, procedimentos e histórico técnico |

## Estrutura inicial

```text
ekoads/
├── README.md
├── docs/
│   ├── ARCHITECTURE.md
│   └── ROADMAP.md
├── modules/
│   ├── google-ads/
│   ├── landing-pages/
│   ├── tracking/
│   ├── integrations/
│   └── analytics/
└── .gitignore
```

A estrutura será criada gradualmente, conforme cada módulo for implementado. Diretórios vazios podem não aparecer no GitHub até receberem arquivos.

## Padrões de rastreamento\n\n- [Contrato do fluxo completo do lead](docs/LEAD_TRACKING_TEMPLATE.md).\n- [Configuração e validação de GA4 via GTM](docs/GA4_GTM_SETUP.md).\n\nO GTM possui loader configurável por implantação e condicionado à escolha de análise. GA4 e Google Ads ainda exigem configuração e validação dentro do container de cada cliente.\n\n## Método de trabalho

Diagnosticar → planejar → implementar uma etapa → testar → validar → documentar.

Nenhuma alteração em campanhas, contas de anúncios, tags ou sites de clientes será feita sem autorização explícita.

## Módulos implementados

- Google Ads: calculadora de indicadores, auditor CSV, Campaign Intelligence e Keyword Intelligence.
- Analytics: diagnóstico econômico de aquisição com funil, CAC, ROAS, margem e contribuição estimada.
- Tracking: checklist manual de GTM/GA4, matriz de eventos, auditoria de evidências e validador preventivo da dataLayer na landing page.
- Landing Pages: modelo responsivo, formulário mínimo, handoff para WhatsApp e eventos sem PII.
- Integrações: protótipo local de acompanhamento do funil comercial com referências pseudônimas e CSV.
- Dashboard: painel executivo local para mídia, funil, origem e resultado econômico.

As ferramentas atuais são protótipos locais no navegador. Ainda precisam de testes funcionais com dados de exemplo e validação antes de uso operacional com clientes.

## Licença

MIT. Consulte o arquivo `LICENSE` quando incluído no repositório.
