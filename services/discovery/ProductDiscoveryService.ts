import { DiscoveryRequest, DiscoveryRequestSchema, DiscoveryResult, ManualImportInput } from '../../types/discovery/discovery.types';
import { DiscoveryError } from '../../types/discovery/discovery.errors';
import { ProductSearchService } from './ProductSearchService';
import { ProductNormalizationService } from './ProductNormalizationService';
import { ProductValidationService } from './ProductValidationService';
import { ProductDeduplicationService } from './ProductDeduplicationService';
import { ProductPersistenceService } from './ProductPersistenceService';
import { DiscoveryJobService } from './DiscoveryJobService';
import { DiscoverySchedulerService } from './DiscoverySchedulerService';
import { Logger } from '../../lib/logger';
import { ProductSourceType } from '@prisma/client';
import { OpportunityRankingEngine } from '../intelligence/OpportunityRankingEngine';

export class ProductDiscoveryService {
  /**
   * Executa o fluxo completo do Product Discovery Engine.
   */
  public static async discoverProducts(rawRequest: unknown): Promise<DiscoveryResult> {
    const startTime = Date.now();
    const warnings: string[] = [];
    const errors: string[] = [];

    // 1. Validar a requisição com Zod
    const parseResult = DiscoveryRequestSchema.safeParse(rawRequest);
    if (!parseResult.success) {
      throw new DiscoveryError(
        'Requisição de descoberta inválida.',
        'INVALID_REQUEST',
        400,
        parseResult.error.flatten().fieldErrors
      );
    }
    const request: DiscoveryRequest = parseResult.data;

    // 2. Verificar limite de concorrência
    const canRun = await DiscoverySchedulerService.canExecuteNewJob();
    if (!canRun) {
      throw new DiscoveryError(
        'Limite de trabalhos de descoberta concorrentes atingido (MAX_CONCURRENT_DISCOVERY_JOBS=1). Tente novamente em alguns instantes.',
        'CONCURRENCY_LIMIT',
        429
      );
    }

    // 3. Criar registro de trabalho em banco
    const jobRecords = await DiscoveryJobService.createDiscoveryJob(
      request.platform,
      request.query,
      request.accountId,
      { limit: request.limit, category: request.category, brand: request.brand }
    );
    const searchId = jobRecords?.search.id;
    const jobId = jobRecords?.job.id;

    try {
      // 4. Executar a busca na plataforma via Adapter
      const rawProducts = await ProductSearchService.executeSearch(
        request.platform,
        request.accountId,
        request.query
      );

      const totalFound = rawProducts.length;
      const normalizedList = [];

      // 5. Normalizar os resultados
      for (const item of rawProducts) {
        const normalized = ProductNormalizationService.normalize(item, request.platform);
        normalizedList.push(normalized);
      }

      // 6. Deduplicar lote
      const { uniqueProducts, duplicateCount } = await ProductDeduplicationService.deduplicateBatch(
        request.platform,
        normalizedList
      );

      let imported = 0;
      let updated = 0;
      let rejected = 0;
      const persistedProducts = [];

      // 7. Validação e Persistência atômica
      for (const prod of uniqueProducts) {
        // Aplicar filtros opcionais da requisição (ex: preço mínimo, preço máximo, rating)
        if (request.minPrice && prod.currentPrice < request.minPrice) continue;
        if (request.maxPrice && prod.currentPrice > request.maxPrice) continue;
        if (request.minRating && prod.rating && prod.rating < request.minRating) continue;

        const validation = ProductValidationService.validateProduct(prod);
        if (!validation.valid && validation.reason) {
          rejected++;
          await ProductValidationService.logRejection(request.platform, prod.externalId, validation.reason, {
            error: validation.errorMessage,
          });
          continue;
        }

        const isExisting = await ProductDeduplicationService.isExistingProduct(request.platform, prod.externalId);

        const sourceType: ProductSourceType = process.env.AFFILIATE_MOCK_MODE === 'true' ? 'MOCK' : 'API';
        const saved = await ProductPersistenceService.upsertProduct(prod, {
          sourceType,
          sourceUrl: prod.url,
          sourceMetadata: { query: request.query, platform: request.platform },
        });

        if (isExisting) {
          updated++;
        } else {
          imported++;
        }

        persistedProducts.push(saved);
      }

      // 8. Aplicar Ranking Matemático Determinístico (Fase P3 / P4)
      const rankedProducts = await OpportunityRankingEngine.rankProducts(persistedProducts as any);

      const executionTimeMs = Date.now() - startTime;

      // 9. Finalizar job e registrar logs
      if (jobId && searchId) {
        await DiscoveryJobService.completeDiscoveryJob(
          jobId,
          searchId,
          { found: totalFound, imported, updated, rejected, executionTimeMs },
          'COMPLETED'
        );
      }

      Logger.info(
        'PRODUCT_DISCOVERY',
        'DISCOVERY_COMPLETED',
        `Descoberta finalizada para '${request.query}' na plataforma ${request.platform}: ${imported} importados, ${updated} atualizados, ${rejected} rejeitados.`,
        { executionTimeMs }
      );

      return {
        success: true,
        searchId,
        jobId,
        platform: request.platform,
        accountId: request.accountId,
        query: request.query,
        totalFound,
        imported,
        updated,
        duplicates: duplicateCount,
        rejected,
        products: rankedProducts,
        warnings,
        errors,
        executionTimeMs,
      };
    } catch (error: any) {
      const executionTimeMs = Date.now() - startTime;
      if (jobId && searchId) {
        await DiscoveryJobService.completeDiscoveryJob(
          jobId,
          searchId,
          { found: 0, imported: 0, updated: 0, rejected: 0, executionTimeMs },
          'FAILED',
          error.message
        );
      }
      throw error;
    }
  }

  /**
   * Suporte a Importação Manual (Mercado Livre e outras plataformas sem API de busca oficial).
   */
  public static async importManualProduct(input: ManualImportInput) {
    const normalized = ProductNormalizationService.normalize(
      {
        externalId: input.externalId,
        affiliatePlatformId: input.affiliatePlatformId,
        title: input.title,
        description: input.description,
        url: input.productUrl,
        imageUrl: input.imageUrl,
        category: input.category,
        brand: input.brand,
        currentPrice: input.currentPrice,
        previousPrice: input.previousPrice,
        currency: 'BRL',
        rating: input.rating,
        reviewCount: input.reviewCount,
        availability: input.availability !== undefined ? input.availability : true,
      },
      input.affiliatePlatformId
    );

    const validation = ProductValidationService.validateProduct(normalized);
    if (!validation.valid && validation.reason) {
      await ProductValidationService.logRejection(input.affiliatePlatformId, normalized.externalId, validation.reason);
      throw new DiscoveryError(`Produto manual inválido: ${validation.errorMessage}`, 'VALIDATION_FAILED', 400);
    }

    const saved = await ProductPersistenceService.upsertProduct(normalized, {
      sourceType: 'MANUAL',
      sourceUrl: input.productUrl,
      sourceMetadata: { notes: input.notes, affiliateUrl: input.affiliateUrl },
    });

    Logger.info('PRODUCT_DISCOVERY', 'MANUAL_IMPORT_SUCCESS', `Produto ${saved.externalId} importado manualmente.`);
    return saved;
  }
}
