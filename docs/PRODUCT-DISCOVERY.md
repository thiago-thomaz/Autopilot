# Product Discovery Engine — Guia Técnico (Módulo 3)

## Visão Geral
O **Product Discovery Engine** é o módulo do **Affiliate Autopilot** responsável por encontrar, buscar, normalizar, validar, deduplicar e armazenar produtos de plataformas de afiliados através de APIs oficiais autorizadas ou de importação manual estruturada.

---

## 1. Fluxo Principal de Execução

```
DISCOVERY REQUEST 
  └─> VALIDATE REQUEST (Zod DiscoveryRequestSchema)
  └─> SELECT PLATFORM & ACCOUNT
  └─> CHECK ACCOUNT STATUS & CAPABILITIES
  └─> CALL ADAPTER (Amazon / MOCK / Manual)
  └─> NORMALIZE RESULTS (ProductNormalizationService)
  └─> VALIDATE PRODUCTS (ProductValidationService)
  └─> DEDUPLICATE (ProductDeduplicationService)
  └─> UPSERT DATABASE (prisma.$transaction)
  └─> RECORD PRICE HISTORY (ProductPriceHistoryService)
  └─> LOG & RETURN DISCOVERY RESULT
```

---

## 2. Regras e Limites do Engine

1. **Limites de Segurança de Busca**:
   - `limit` máximo = 10 produtos por requisição.
   - `page` máxima = 10.
   - Timeout por chamada HTTP = 15 segundos.
   - `MAX_CONCURRENT_DISCOVERY_JOBS` = 1 (por padrão).

2. **Deduplicação & Atomicidade**:
   - Deduplicação primária via chave única composta `@@unique([affiliatePlatformId, externalId])`.
   - Gravação atômica através de transação `prisma.$transaction()`.

3. **Histórico de Preços**:
   - O histórico em `ProductPriceHistory` é gravado de forma condicional: apenas quando houver mudança de preço (`currentPrice`), preço anterior (`previousPrice`) ou disponibilidade (`availability`) em relação ao último registro capturado.

4. **Modo Manual (Mercado Livre)**:
   - Para plataformas sem API aberta de busca para afiliados (ex: Mercado Livre), o sistema opera em modo `MANUAL_IMPORT` (sem scraping, sem browser automation e sem violação dos Termos de Uso).

---

## 3. Endpoints da API

- `POST /api/discovery/search`: Executa o engine de descoberta.
- `GET /api/discovery/searches`: Lista buscas recentes.
- `GET /api/discovery/jobs`: Lista trabalhos de descoberta.
- `GET /api/products`: Lista produtos cadastrados no banco com filtros.
- `GET /api/products/:id`: Detalha um produto.
- `GET /api/products/:id/price-history`: Retorna o histórico de preços de um produto.
- `POST /api/products/import`: Importa produto manualmente.
- `POST /api/discovery/queries`: Cria consulta salva.
- `POST /api/discovery/queries/:id/run`: Executa consulta salva manualmente.

### Webhooks n8n (Header `x-n8n-api-key`):
- `POST /api/n8n/discovery/search`
- `POST /api/n8n/discovery/product`
