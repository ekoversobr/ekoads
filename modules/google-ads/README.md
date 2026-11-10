# Módulo Google Ads

Primeira ferramenta do EKOADS: calculadora de indicadores de mídia e funil comercial.

## Objetivo

Transformar dados agregados de uma campanha em indicadores básicos para diagnóstico. A ferramenta não acessa contas Google Ads, não altera campanhas e não substitui a validação dos dados comerciais.

## Como usar

1. Abra `index.html` em um navegador ou publique a pasta em hospedagem estática.
2. Informe os dados do mesmo período e escopo (campanha, grupo ou conta).
3. Informe valores agregados, sem nomes, telefones, e-mails ou dados clínicos.
4. Leia os indicadores e confira as definições abaixo.

## Indicadores

- CTR = cliques ÷ impressões × 100.
- CPC médio = custo ÷ cliques.
- CPL = custo ÷ leads recebidos.
- CPQL = custo ÷ leads qualificados.
- Custo por agendamento = custo ÷ agendamentos.
- CAC de mídia = custo de mídia ÷ novos clientes atribuídos.
- ROAS = receita atribuída ÷ custo de mídia.

Taxas:
- Conversão de clique em lead = leads ÷ cliques.
- Qualificação = leads qualificados ÷ leads.
- Agendamento = agendamentos ÷ leads qualificados.
- Fechamento = novos clientes ÷ leads qualificados.

## Limitações

- Use o mesmo período e escopo em todos os campos.
- Não some etapas diferentes como se fossem conversões equivalentes.
- CAC calculado apenas com mídia não representa CAC total se houver equipe, ferramentas, produção ou outros custos.
- ROAS não é lucro nem ROI.
- Receita deve ser atribuída com critério consistente e, preferencialmente, reconciliada com registros comerciais.
- Quando o denominador for zero, a ferramenta mostra “—” em vez de inventar um resultado.

## Privacidade

Não insira dados pessoais ou sensíveis. A calculadora opera localmente no navegador e não envia os valores para servidor.
