# Dashboard Executivo

Painel local que combina indicadores agregados de mídia com dados exportados do protótipo Lead Operations.

## Como usar
1. Abra `dashboard.html` no navegador.
2. Informe cliente, período, investimento, impressões, cliques, outros custos e margem bruta.
3. Importe o CSV de Lead Operations ou informe manualmente os totais do funil.
4. Confira alertas e indicadores; exporte o resumo.

## Indicadores
CTR, CPC, CPL, CPQL, custo por agendamento, CAC de aquisição, ROAS e contribuição estimada após margem bruta, mídia e outros custos de aquisição.

## Cuidados
- Use mesmo cliente, período, moeda e escopo para mídia e operação.
- A importação agrega os estados atuais dos registros por origem. Não é análise de coorte nem histórico de transições.
- A tabela por origem apresenta volume e receita registrados, mas não calcula ROAS por origem porque o CSV operacional não contém custo de mídia segmentado.
- Não confunda clique com lead, lead com qualificado ou agendamento com venda.
- A contribuição estimada não equivale a lucro líquido.
- Verifique se valores de vendas são receita efetivamente conciliada.
- O painel não tem persistência em servidor, autenticação ou sincronização. Não use para dados pessoais ou sensíveis.
- Não há conexão automática com Google Ads, GA4, GTM ou CRM.

## Próximos requisitos antes de produção
Backend seguro, autenticação, isolamento multi-cliente, controle de acesso, trilha de auditoria, integração autorizada com fontes e testes com coortes maduras.
