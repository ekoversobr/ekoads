# Analytics — Diagnóstico Econômico

Ferramenta local para avaliar a economia de aquisição conectando investimento em mídia, custos operacionais, etapas do funil, receita atribuída e margem bruta.

## Como usar
1. Abra `economics.html` em um navegador.
2. Preencha valores agregados do mesmo período/coorte e escopo.
3. Informe receita atribuída e margem bruta estimada.
4. Calcule, revise as ressalvas e exporte o CSV.

## Indicadores
- CPL, CPQL e custo por agendamento: calculados sobre investimento em mídia.
- CAC de mídia: investimento em anúncios dividido por novos clientes.
- CAC incluindo outros custos: mídia mais outros custos de aquisição, dividido por novos clientes.
- ROAS: receita atribuída dividida por investimento em mídia.
- Contribuição estimada: receita × margem bruta, menos custos variáveis de entrega e custos de aquisição informados.
- Retorno sobre aquisição: contribuição estimada dividida pelo custo total de aquisição informado.
- CAC de equilíbrio estimado: margem bruta por cliente. É uma referência simplificada, não o ponto de equilíbrio integral da empresa.

## Cuidados metodológicos
- Use o mesmo período e escopo. Quando o ciclo de vendas atravessar meses, prefira análise por coorte.
- CAC e ROAS dependem de atribuição consistente e conversões maduras.
- Não confunda ROAS com lucro ou retorno líquido.
- A margem bruta deve refletir custos diretos; evite duplicar custos.
- O CAC calculado não inclui despesas não informadas.
- O modelo valida sequência simples: leads ≥ qualificados ≥ agendamentos ≥ clientes. Se o processo real não seguir essa sequência, não force a interpretação.
- Os dados ficam no navegador; não há integração com Ads, CRM ou servidor.
- Não inserir dados pessoais ou sensíveis, especialmente informações de saúde.

## Segurança operacional
A ferramenta apenas calcula e exporta dados agregados. Não altera campanhas, contas, tags ou registros comerciais.
