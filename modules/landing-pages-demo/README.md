# Eko Verso — ambiente de homologação

Esta página é uma cópia isolada do template mestre para testes internos.

- Marca de demonstração: EKO VERSO.
- WhatsApp real: desativado.
- GTM: desativado.
- GA4/Google Ads: não conectados.
- Formulário: simulação local; não envia mensagens nem armazena leads.
- Não inserir dados pessoais, clínicos ou de clientes.

## Testes
1. Abrir `index.html` por servidor HTTP local ou hospedagem de teste.
2. Sem consentimento analítico, nenhum evento da página deve entrar na dataLayer.
3. Com consentimento, os eventos permitidos passam pelo validador; GTM permanece desativado porque não há ID.
4. Submeter o formulário com consentimento de contato: deve aparecer SIMULAÇÃO CONCLUÍDA, sem abrir WhatsApp.
5. Testar retirada do consentimento analítico.

Este ambiente não deve ser usado em anúncios nem apresentado como página comercial. O template mestre original permanece em `modules/landing-pages/`.
