# Integrations — Lead Operations

Protótipo local para acompanhar o estado atual de registros no funil comercial, com dados minimizados.

## Arquivos
- `leads.html`: interface de registro, resumo e filtros.
- `leads.js`: validação, persistência local, importação/exportação CSV e contagem por etapa.

## Modelo de dados
Cada registro contém somente:
- referência aleatória não identificável;
- origem de aquisição;
- canal de entrada;
- etapa atual;
- valor comercial atribuído;
- data de referência.

Não armazenar nome, telefone, e-mail, texto de conversa, dados clínicos, sintomas, diagnóstico ou outros dados pessoais/sensíveis.

## Como usar
Abra `leads.html` no navegador. Crie uma referência aleatória por oportunidade e atualize a etapa atual. A mesma referência atualiza o registro existente. Exporte CSV para análise agregada ou importe um arquivo com cabeçalhos `ref,source,channel,stage,value,date`.

## Limitações
- Dados permanecem no localStorage do navegador e podem ser perdidos ao limpar dados locais.
- Não existe sincronização, autenticação, controle de acesso, backup automático ou trilha histórica.
- A etapa é o estado atual; o módulo não mede tempos entre etapas nem conversão por coorte.
- A contagem por etapa não é um funil sequencial de coorte.
- Valor só deve ser preenchido quando houver receita efetivamente atribuída e conciliada.
- Não é CRM nem integração real com WhatsApp, formulários, Ads ou CRM externo.

## Próxima evolução
Definir backend seguro, autenticação, isolamento multi-cliente, trilha de auditoria, política de retenção e conectores oficiais antes de armazenar dados operacionais reais. Qualquer integração deve minimizar dados e observar LGPD e políticas das plataformas.
