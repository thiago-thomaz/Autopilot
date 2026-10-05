# 🔐 Acessos e Configurações do Projeto - Affiliate Autopilot (100% Autônomo e Nativo)

Este documento contém a documentação definitiva da operação 100% autônoma nativa (sem qualquer dependência de n8n). O sistema orquestra nativamente no processo Node.js o agendamento de cron, descoberta de produtos, geração de cópias, despacho de publicações, réguas de cadência (T-24h, T-6h) e reconciliação financeira.

## 🌍 Endereços e Domínios
- **Servidor Principal (Coolify):** `http://72.62.13.62:8000`
- **Dashboard / API Next.js (Produção):** `https://cop.projetosunion.cloud`

## 🤖 Motor Autônomo Nativo (InternalAutonomousEngine)
- **Tecnologia:** Motor in-process Node.js / TypeScript com suporte a `instrumentationHook` no boot e worker daemon (`scripts/autonomous-daemon.ts`).
- **Zero Dependências Externas:** O sistema não depende de n8n, serviços de terceiros ou cron de sistema operacional para suas automações vitais.
- **Loops Automáticos Nativos:**
  1. `DISCOVER_DEALS` (a cada 3 horas): busca ofertas na Amazon Brasil e Mercado Livre, rankeia com algoritmo determinístico e gera copies.
  2. `PROCESS_PUBLISH_QUEUE` (a cada 2 minutos): despacha posts pendentes para canais configurados (Telegram / WhatsApp).
  3. `SCHEDULED_REMINDERS` (a cada 5 minutos): avalia réguas de comunicação (T-24h, T-6h) e envia publicações agendadas.
  4. `RUN_DECISION_CYCLE` (a cada 1 hora): avalia métricas de risco, orçamento e políticas autônomas.
  5. `CLEANUP_EXPIRED_DATA` (a cada 24 horas): faxina de logs e produtos arquivados.

## 🔌 APIs Internas Nativas
- **Status do Motor:** `GET https://cop.projetosunion.cloud/api/automation/status`
- **Disparo Manual / Webhook Nativo:** `POST https://cop.projetosunion.cloud/api/automation/run`
  - Cabeçalho: `x-automation-api-key: [INTERNAL_AUTOMATION_KEY]`
  - Body: `{"job": "DISCOVER_DEALS" | "GENERATE_POSTS" | "PROCESS_PUBLISH_QUEUE" | "SCHEDULED_REMINDERS" | "FULL_CYCLE"}`
- **Controle do Agendador:** `POST https://cop.projetosunion.cloud/api/automation/scheduler`
  - Body: `{"action": "START" | "STOP" | "STATUS"}`

## 🤖 Canais de Publicação (Roteamento Multi-Canal)

### Telegram
- **Bot Token:** `8807320383:AAGF3ZcEgCM_I--_XlDXPgWcLAw0EYoWefQ`
- **Chat ID (Grupo Destino):** `-1004361711015`

### WhatsApp (Z-API / Evolution API)
- A aplicação substitui Markdown padrão de negrito `**` por `*` automaticamente no módulo `PublicationPlanner` de forma segura sem corromper links.
- O adaptador de WhatsApp (`WhatsAppActionAdapter.ts`) despacha a requisição HTTP e trata *Opt-out* via palavras-chave (ex: STOP, SAIR).

## 🎯 Rota de Tracking e Analytics (Anti-Bot e Idempotência)
- **URL Base Oficial de Redirecionamento:** `https://cop.projetosunion.cloud/api/r?p=[PUBLICATION_ID]`
- A rota computa o clique de forma totalmente assíncrona. Quedas intermitentes do Banco não bloqueiam o redirecionamento do cliente (`resiliência absoluta`).
- Links rejeitados, pausados ou expirados retornam bloqueio instantâneo com **HTTP 410 Gone**, não havendo risco de Open Redirects arbitrários por invasores.

## 🛒 Contas de Afiliado Associadas

### Amazon Brasil
- **Partner Tag (Associates Tag):** `thomazpromos-20`
- **Tracking Nativo:** A tag é injetada nativamente via URL no momento do registro. Sem necessidade de chaves de API restritas e burocráticas da Product Advertising API da Amazon para a camada base.

### Mercado Livre
- A adaptação de links do Mercado Livre é feita validando a URL final, acoplando UTMs dinâmicas ao lado de *subIds* com rastreabilidade 1 para 1.

## 🗄️ Banco de Dados (Prisma ORM)
- **Tipo:** PostgreSQL
- **Banco:** `affiliate_autopilot`
- **Schema:** `public`
- **Conexão Local/Docker:** `postgresql://postgres:postgres@localhost:5432/affiliate_autopilot?schema=public`

## ⚙️ Variáveis de Ambiente Críticas
- `JWT_SECRET=super-secret-key-change-in-production`
- `INTERNAL_AUTOMATION_KEY=autopilot-internal-secret-2026`
- `ENABLE_AUTOMATION=true`
- `AFFILIATE_MOCK_MODE=false` (Modo produção real)
- `MOCK_LLM=false` (Engine determinística inteligente de custo zero)
- `OPERATION_MODE=AUTOMATICO`

## 🛠️ Comandos de Saúde (Health) e Manutenção
- **Validar Database Model:** `npx prisma validate`
- **Rodar Suíte QA (133 Testes de Proteção):** `npm run test`
- **Verificação Estática TS (Typings):** `npx tsc --noEmit`
- **Build Core de Produção:** `npm run build`
