# EKOADS — Arquitetura Técnica

**Versão:** 0.1  
**Status:** proposta inicial

## 1. Visão

O EKOADS será um conjunto modular de ferramentas e padrões para aquisição digital, páginas de conversão, mensuração e inteligência comercial. O repositório começa como uma base de código e documentação; funcionalidades serão adicionadas somente após definição e validação de requisitos.

## 2. Princípios arquiteturais

- **Modularidade:** cada módulo deve ter responsabilidade clara e poder evoluir sem exigir a reescrita dos demais.
- **Isolamento por cliente:** contas, IDs, domínios, leads, credenciais e dados nunca serão compartilhados entre clientes.
- **Configuração separada do código:** identificadores e parâmetros específicos ficam em arquivos de configuração não sensíveis.
- **Privacidade por padrão:** coletar o mínimo necessário; não enviar dados pessoais ou dados sensíveis de saúde para ferramentas de publicidade.
- **Rastreabilidade:** documentar origem, disparo, destino e significado de cada evento.
- **Validação:** nenhuma métrica será considerada conversão comercial sem evidência compatível com sua definição.

## 3. Módulos

### Google Ads
Documentação e ferramentas para estrutura de campanhas, grupos, palavras-chave, negativas, anúncios, orçamento, lances, geografia, termos de pesquisa e análise econômica.

### Landing Pages
Modelos de páginas responsivas, acessíveis e rápidas. Cada página deve manter coerência entre consulta, anúncio, oferta e chamada para ação.

### Tracking
Padrões de instalação e configuração de GTM e GA4, eventos, parâmetros, consentimento, depuração e validação de conversões.

### Integrações
Conexões com formulários, WhatsApp, planilhas e CRM. Integrações devem tratar erros, evitar duplicidade e não expor credenciais.

### Analytics
Indicadores de mídia, funil comercial e economia. Relatórios devem informar período, fonte, amostra, premissas e limitações.

## 4. Modelo de mensuração

Funil de referência:

`Anúncio → Clique → Página → Ação de contato → Lead recebido → Lead qualificado → Agendamento → Comparecimento → Venda → Receita recebida`

Eventos de referência:
- `page_view`
- `view_service`
- `form_start`
- `form_submit`
- `whatsapp_click`
- `whatsapp_handoff`
- `lead_received`
- `qualified_lead`
- `appointment_scheduled`
- `appointment_attended`
- `purchase`
- `revenue_received`

Um clique no WhatsApp não comprova conversa; um formulário submetido não comprova qualificação; um agendamento não comprova comparecimento ou venda. A definição e a evidência de cada evento devem estar documentadas. Nem todo evento deve ser conversão primária no Google Ads.

## 5. Isolamento dos clientes

Cada cliente deverá ter, no mínimo, configurações independentes para:
- domínio e páginas;
- conta Google Ads;
- container GTM;
- propriedade GA4;
- conversões;
- canais de contato;
- base comercial e relatórios.

Não incluir IDs reais, tokens, senhas ou dados de clientes em exemplos públicos. Usar valores fictícios em arquivos de exemplo.

## 6. Segurança e privacidade

- Nunca versionar tokens, senhas, chaves privadas ou arquivos de credenciais.
- Usar variáveis de ambiente ou mecanismos seguros para segredos, quando aplicável.
- Minimizar coleta e retenção de dados.
- Não incluir dados clínicos ou identificadores pessoais em URLs, UTMs, nomes de eventos ou parâmetros de anúncios.
- Avaliar consentimento e requisitos legais antes de ativar tecnologias de rastreamento.
- Restringir acessos às contas e bases de clientes.

## 7. Qualidade e publicação

Antes de publicar qualquer módulo:
1. Revisar escopo e impacto.
2. Testar em ambiente separado.
3. Validar em dispositivos e navegadores relevantes.
4. Verificar eventos e ausência de duplicidade.
5. Documentar limitações e procedimento de reversão.
6. Obter autorização para alterações em ambientes de produção.

## 8. Decisões ainda abertas

As escolhas abaixo serão feitas quando o módulo correspondente entrar em desenvolvimento:
- framework ou abordagem de frontend;
- estratégia de hospedagem e domínios;
- ferramenta de CRM;
- armazenamento e processamento de dados;
- automações e integrações;
- política de testes automatizados e CI/CD.

Não adicionar dependências ou serviços antes de existir uma necessidade concreta.
