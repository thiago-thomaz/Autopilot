# 🔐 Acessos e Credenciais do Projeto - Affiliate Autopilot

Aqui estão reunidos todos os acessos, links e chaves de configuração identificados durante nosso trabalho neste projeto.

## 🌍 Endereços Oficiais da Aplicação
- **Servidor Principal (Coolify):** `http://72.62.13.62:8000`
- **Dashboard / API Next.js (Produção):** `https://cop.projetosunion.cloud`
- **N8N (Se estiver rodando acoplado via Docker):** Utiliza a chave `x-n8n-api-key` no header da API

## 🤖 Automação e Integrações

### Telegram
- **Bot Token:** `8807320383:AAGF3ZcEgCM_I--_XlDXPgWcLAw0EYoWefQ`
- **Chat ID (Grupo Destino):** `-1004361711015`

### N8N Webhooks (Internos)
- **Chave de API (Secret Key):** `n8n_secret_autopilot_key_2026`

## 🛒 Contas de Afiliado

### Amazon Brasil
- **Partner Tag (Associates Tag):** `thomazpromos-20`
- **Modo Atual:** Os IDs de credenciais completas da Amazon API não estão preenchidos, então a aplicação utiliza a Tag para gerar links diretamente via `url?tag=thomazpromos-20`.

## 🗄️ Banco de Dados
- **Tipo:** PostgreSQL
- **Banco:** `affiliate_autopilot`
- **Schema:** `public`
- **Conexão Local/Docker:** `postgresql://postgres:postgres@localhost:5432/affiliate_autopilot?schema=public`
- *Nota: Na VPS do Coolify, as credenciais e porta do Postgres são protegidas pela rede interna do Docker (traefik).*

## ⚙️ Variáveis de Ambiente Críticas
- **JWT_SECRET:** `super-secret-key-change-in-production`
- **AFFILIATE_MOCK_MODE:** `false`
- **MOCK_LLM:** `false`
- **OPERATION_MODE:** `MANUAL`
- **AUTONOMOUS_MODE:** `SUPERVISED`
