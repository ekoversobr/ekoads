# Publicação da landing page do template EKOADS

## Estado

O workflow de publicação está preparado, mas não foi executado. Nenhuma página foi publicada por esta alteração.

## Antes de publicar uma implantação

1. Use uma cópia/repositório próprio do cliente. Não publique a partir do template mestre com configurações de demonstração.
2. Em `modules/landing-pages/config.js`, configure marca, WhatsApp oficial e URL HTTPS do aviso de privacidade.
3. Configure o ID GTM do cliente somente se o container estiver preparado e validado. O campo pode permanecer vazio.
4. Revise texto, oferta, domínio, acessibilidade, consentimento, políticas de privacidade e regras aplicáveis ao setor.
5. Confirme que nenhum identificador, dado pessoal, token ou segredo de outro cliente está no repositório.
6. Faça os testes automatizados e revise a landing page em desktop e mobile.

## Publicar

1. No repositório da implantação, abra **Settings → Pages**.
2. Selecione **GitHub Actions** como fonte de publicação, se solicitado.
3. Abra **Actions → Publish landing page template**.
4. Clique em **Run workflow** e confirme a branch `main`.
5. Aguarde os jobs `build` e `deploy) ficarem verdes.
6. Abra a URL exibida no ambiente `github-pages`.

O workflow é manual e contém uma barreira de configuração: bloqueia publicação se marca, WhatsApp ou URL HTTPS de privacidade continuarem em branco/de exemplo. Ele publica somente os arquivos necessários da landing page e do validador, não o restante do repositório.

## Pós-publicação: teste obrigatório

- HTTPS e carregamento sem erros.
- Mobile e desktop.
- WhatsApp correto; não enviar mensagem sem revisar o destino.
- Sem consentimento: GTM não deve carregar.
- Com consentimento: container correto carrega uma vez.
- Eventos permitidos aparecem na dataLayer.
- Tag Assistant confirma tags e estados de consentimento.
- GA4 DebugView confirma eventos sem duplicidade nem dados pessoais.
- Formulário/CTA não deve ser tratado como lead recebido.
- Confirmar aviso de privacidade e mecanismo de retirada de consentimento.

## Limitações

GitHub Pages é hospedagem estática. Não recebe, valida ou armazena leads e não fornece backend, CRM ou confirmação de conversa WhatsApp. A publicação não significa que GTM, GA4 ou conversões Google Ads estejam funcionando.
