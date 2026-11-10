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

## Auditor CSV

Abra `auditor.html` para usar o auditor local de relatórios CSV.

O auditor reconhece cabeçalhos em português e inglês para termo/palavra-chave, impressões, cliques, custo, conversões e valor de conversão. As colunas de cliques e custo são obrigatórias; as demais habilitam análises adicionais.

O relatório apresenta totais, CTR, CPC, CPA, ROAS (quando houver valor de conversão), linhas com custo e zero conversões e linhas com conversões.

**Importante:** zero conversões em uma linha não significa automaticamente desperdício. Considere janela e atraso de conversão, volume, intenção, qualidade dos leads e resultado comercial antes de negativar termos ou pausar palavras-chave. A ferramenta não faz alterações na conta.

## Campaign Intelligence

Abra `intelligence.html` para executar a análise por regras explicáveis sobre um CSV de termos de pesquisa ou palavras-chave.

Parâmetros configuráveis:
- mínimo de cliques para sinalizar;
- mínimo de custo para sinalizar;
- CPA de referência opcional.

A fila classifica linhas para investigação e exporta um CSV com prioridade e motivos. A prioridade alta indica apenas que os limites escolhidos foram ultrapassados sem conversão reportada; não prova desperdício e não autoriza negativação automática.

A ferramenta é uma análise local, não uma integração com a API do Google Ads.
