# 🔐 Acessos e Configurações do Projeto - Affiliate Autopilot (FINAL)

Este documento contém a documentação definitiva da operação 100% autônoma (Fases P0 a P4). Guarde este arquivo em segurança, pois ele contém as chaves, parâmetros e a arquitetura completa para operar o sistema 24/7.

## 🌍 Endereços e Domínios
- **Servidor Principal (Coolify):** `http://72.62.13.62:8000`
- **Dashboard / API Next.js (Produção):** `https://cop.projetosunion.cloud`

## 🤖 Canais de Publicação (Roteamento Multi-Canal P4)

### Telegram
- **Bot Token:** `8807320383:AAGF3ZcEgCM_I--_XlDXPgWcLAw0EYoWefQ`
- **Chat ID (Grupo Destino):** `-1004361711015`

### WhatsApp (Z-API / Evolution API)
- A aplicação substitui Markdown padrão de negrito `**` por `*` automaticamente no módulo `PublicationPlanner` de forma segura sem corromper links.
- O adaptador de WhatsApp (`WhatsAppActionAdapter.ts`) despacha a requisição HTTP e trata *Opt-out* via palavras-chave (ex: STOP, SAIR).

## 🔌 API Interna e Webhooks (N8N)
- **Base Endpoint:** `https://cop.projetosunion.cloud/api/n8n/events`
- **Chave de API (Secret Key):** `n8n_secret_autopilot_key_2026`
- **Autenticação:** Para chamar a API remotamente via N8N ou CronTabs de VPS, utilize o cabeçalho HTTP obrigatório:
  - `x-n8n-api-key: n8n_secret_autopilot_key_2026`
- **Eventos Suportados no Payload (`POST` JSON):**
  - `{"event": "DISCOVER_DEALS"}` -> Dispara a busca de produtos na Amazon/ML.
  - `{"event": "GENERATE_POSTS"}` -> Dispara geração de copy e aplica o ranking matemático de priorização.
  - `{"event": "PROCESS_PUBLISH_QUEUE"}` -> Dispara o fan-out da postagem para Telegram/WhatsApp baseada nos grupos associados.

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
- **Performance (P4):** As tabelas críticas possuem índices específicos (ex: `@@index([clickEventId])` e `@@index([convertedAt])`) para suportar a engine assíncrona do *Feedback Loop* (onde pesos do ranking são recalculados baseados nas vendas confirmadas dos últimos 7 dias) sem risco de *Table Scans*.

## ⚙️ Variáveis de Ambiente (.env) Críticas
- `JWT_SECRET=super-secret-key-change-in-production`
- `N8N_API_KEY=n8n_secret_autopilot_key_2026`
- `AFFILIATE_MOCK_MODE=false` (Pronto para o mundo real).
- `MOCK_LLM=false` (A aplicação P4 consolidou as lógicas usando matemática pura determinística de priorização, mantendo o custo de inteligência de LLMs em ZERO na operação autônoma vital).
- `OPERATION_MODE=AUTOMATICO`

## 🛠️ Comandos de Saúde (Health) e Manutenção
- **Validar Database Model:** `npx prisma validate`
- **Rodar Suíte QA (127 Testes de Proteção):** `npm run test`
- **Verificação Estática TS (Typings):** `npx tsc --noEmit`
- **Build Core de Produção:** `npm run build`
