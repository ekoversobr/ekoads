# EKOADS — testes e validação

## Verificações automatizadas

O workflow `.github/workflows/quality.yml` executa em push para `main` e em pull requests:

1. `node --check` em todos os arquivos JavaScript dos módulos.
2. Verificação de referências locais `<script src="...">` em arquivos HTML.

Execute localmente, na raiz do repositório:

```bash
find modules -type f -name '*.js' -exec node --check {} \;
node tests/smoke-check.mjs
```

## Escopo e limites

Esses testes verificam sintaxe JavaScript e existência de scripts locais referenciados no HTML. Não simulam navegador, não validam interações DOM, não testam importação/exportação CSV, não comprovam cálculos de negócio e não validam integrações com Google Ads, GTM, GA4 ou CRM.

## Próxima camada de testes

- Casos unitários para cálculos econômicos e indicadores.
- CSV: BOM, CRLF, campos com aspas, delimitadores e números no padrão brasileiro.
- Funil comercial: transições, estados atuais e registros inválidos.
- Testes de navegador para formulários, filtros, importação e exportação.
- Segurança, consentimento, isolamento entre clientes e acessibilidade.

Não considerar um módulo aprovado para produção apenas porque o workflow está verde.
