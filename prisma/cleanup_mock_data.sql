-- ============================================================
-- SCRIPT DE LIMPEZA / PURGA DE DADOS MOCK E STALE DO BANCO
-- Affiliate Autopilot - Produção Real
-- Executar SOMENTE após virada para modo de produção real
-- ============================================================

-- 1. Remove produtos com externalId de ASINs sabidamente obsoletos ou de mock
DELETE FROM "Product"
WHERE
  "externalId" IN ('B092DC27PN', 'B07NRR739V', 'B08FCMK8LN', 'B073VTVS44')
  OR "sourceType" = 'MOCK';

-- 2. Remove produtos com URL contendo tags de teste (demo-20, meutagafiliado-20)
DELETE FROM "Product"
WHERE
  "url" LIKE '%tag=demo-20%'
  OR "url" LIKE '%tag=meutagafiliado-20%'
  OR "url" LIKE '%tag=ml_afiliado_%';

-- 3. Atualiza produtos existentes com URLs Amazon para incluir a tag real de produção
-- (Seguro: só substitui padrões de tag específicos sem mudar a estrutura do link)
UPDATE "Product"
SET
  "url" = regexp_replace("url", 'tag=demo-20', 'tag=thomazpromos-20', 'g'),
  "updatedAt" = NOW()
WHERE
  "url" LIKE '%tag=demo-20%'
  AND "url" LIKE '%amazon.com.br%';

-- 4. Remove publicações e conteúdos filhos de produtos deletados (cascade automático pelo Prisma)
-- A relação cascata no schema já garante que ContentPackages, ClickEvents, Conversions
-- e outros registros filhos serão removidos automaticamente com os Products acima.

-- 5. Limpa snapshots de oportunidade que ficaram órfãos (caso existam)
DELETE FROM "OpportunitySnapshot"
WHERE "productId" NOT IN (SELECT "id" FROM "Product");

-- 6. Limpa alertas de oportunidade órfãos
DELETE FROM "OpportunityAlert"
WHERE "productId" NOT IN (SELECT "id" FROM "Product");

-- 7. Relatório de limpeza
SELECT
  'Produtos restantes' AS label, COUNT(*) AS total FROM "Product"
UNION ALL
SELECT 'Produtos MOCK restantes', COUNT(*) FROM "Product" WHERE "sourceType" = 'MOCK'
UNION ALL
SELECT 'Produtos API', COUNT(*) FROM "Product" WHERE "sourceType" = 'API'
UNION ALL
SELECT 'Produtos MANUAL', COUNT(*) FROM "Product" WHERE "sourceType" = 'MANUAL';
