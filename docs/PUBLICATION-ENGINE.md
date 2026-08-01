# Affiliate Autopilot — Módulo 6: Omnichannel Publication & Distribution Engine (Versão Internacional)

## 1. Visão Geral
O **Módulo 6** é o motor de distribuição internacional da plataforma **Affiliate Autopilot**. Ele é responsável por pegar conteúdos e ofertas aprovados pelo Content Engine (Módulo 5) e distribuí-los automaticamente para 20 canais internacionais (redes sociais, apps de mensageria, site próprio, e-mail, web push e RSS).

## 2. Arquitetura do Fluxo
`PRODUCT` → `OPPORTUNITY` → `CONTENT PACKAGE` → `CONTENT VERSION` → `READY_FOR_PUBLICATION` → `PUBLICATION PLANNER` → `CHANNEL ADAPTER` → `TRACKING LINK` → `COMPLIANCE VALIDATION` → `PUBLICATION QUEUE` → `PUBLICATION WORKER` → `CHANNEL` → `PUBLICATION RESULT`

## 3. Canais Suportados (20 Canais)
- **Core Channels**: INSTAGRAM, FACEBOOK_PAGES, YOUTUBE, YOUTUBE_SHORTS, PINTEREST, X, THREADS, WHATSAPP, TELEGRAM, BLOG, EMAIL, OWN_WEBSITE, WEB_PUSH, RSS.
- **Secondary Channels**: TIKTOK, SNAPCHAT, LINKEDIN_PAGES, GOOGLE_BUSINESS_PROFILE, DISCORD, REDDIT.

## 4. Princípio de Conformidade & Pacotes Manuais
- Nenhuma automação invasiva (sem Selenium, sem Playwright, sem scraping para postar, sem bypass de CAPTCHA).
- Redes sociais sem API aberta ou que exijam aprovação humana (ex: Reddit) utilizam o status `MANUAL_REQUIRED` e geram o pacote `MANUAL_PUBLICATION_PACKAGE` com a explicação `WHY MANUAL?` no dashboard `/publications/[id]`.

## 5. Opt-In e Gestão de Consentimento
- **WhatsApp**: Suporte a palavras de opt-out (`STOP`, `SAIR`, `CANCELAR`). Números na lista de supressão disparam `ConsentViolationError`.
- **E-mail**: Suporte a link de unsubscribe e CAN-SPAM / GDPR compliance.

## 6. Fila & Idempotência
- Leitura atômica de tarefas na fila via `SKIP LOCKED`.
- `idempotencyKey` derivada de `contentVersionId + channel + accountId + country + campaignId + scheduledAt`.

## 7. Site Próprio & SEO Internacional
- Rota pública `/deals/:slug` exibindo preço, desconto, aviso de afiliado e link rastreado.
- Rota `/sitemap.xml` para indexação em motores de busca com suporte a `hreflang` e schema.org.
