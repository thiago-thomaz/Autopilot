# Setup e Integração n8n - Affiliate Autopilot

Esta documentação fornece as chamadas HTTP (nós HTTP do n8n) necessárias para rodar o sistema de forma 100% autônoma.
Substitua `{{API_URL}}` pela URL do seu servidor (ex: App no Coolify) e `{{N8N_SECRET}}` pelo valor da variável do seu ambiente.

## 1. Cron de Descoberta (DISCOVER_DEALS)
Gatilho: Cron (a cada 3 horas, ou conforme desejado)
Ação: Dispara a busca por novas ofertas.

**HTTP Request Node:**
- **Method:** POST
- **URL:** `{{API_URL}}/api/n8n/events`
- **Headers:**
  - `Content-Type`: `application/json`
  - `x-n8n-secret`: `{{N8N_SECRET}}`
- **Body JSON:**
```json
{
  "event": "DISCOVER_DEALS",
  "payload": {
    "source": "n8n_cron"
  }
}
```

## 2. Cron de Publicação (PROCESS_PUBLISH_QUEUE)
Gatilho: Cron (Frequência recomendada: a cada 10 ou 15 minutos)
Ação: Processa a fila e envia ofertas aprovadas para Telegram/WhatsApp.

**HTTP Request Node:**
- **Method:** POST
- **URL:** `{{API_URL}}/api/n8n/events`
- **Headers:**
  - `Content-Type`: `application/json`
  - `x-n8n-secret`: `{{N8N_SECRET}}`
- **Body JSON:**
```json
{
  "event": "PROCESS_PUBLISH_QUEUE",
  "payload": {}
}
```

## 3. Cron de Ingestão de Relatórios (CSVs)
Gatilho: Cron (1x ao dia) ou Email (ao receber o CSV da Amazon/Mercado Livre).
Ação: Envia as vendas realizadas para o ConversionService para fechamento de caixa.

**HTTP Request Node:**
- **Method:** POST
- **URL:** `{{API_URL}}/api/n8n/events`
- **Headers:**
  - `Content-Type`: `application/json`
  - `x-n8n-secret`: `{{N8N_SECRET}}`
- **Body JSON:**
```json
{
  "event": "IMPORT_CONVERSIONS",
  "payload": {
    "platform": "AMAZON", // ou MERCADO_LIVRE
    "data": [
      {
        "clickId": "id-do-click", // ascsubtag ou subid
        "commission": 15.50,
        "saleValue": 150.00,
        "date": "2026-08-24"
      }
    ]
  }
}
```

## 4. Cron de Manutenção Diária (CLEANUP_EXPIRED_DATA)
Gatilho: Cron (1x ao dia, de madrugada)
Ação: Limpeza de logs antigos e ofertas expiradas.

**HTTP Request Node:**
- **Method:** POST
- **URL:** `{{API_URL}}/api/n8n/events`
- **Headers:**
  - `Content-Type`: `application/json`
  - `x-n8n-secret`: `{{N8N_SECRET}}`
- **Body JSON:**
```json
{
  "event": "CLEANUP_EXPIRED_DATA",
  "payload": {}
}
```
