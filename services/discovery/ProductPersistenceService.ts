import { NormalizedProductInput } from '../affiliate/types/affiliate.types';
import { ProductPriceHistoryService } from './ProductPriceHistoryService';
import { ProductService } from '../products';
import { prisma } from '../../lib/prisma';
import { Logger } from '../../lib/logger';
import { ProductSourceType } from '@prisma/client';

export interface PersistOptions {
  sourceType?: ProductSourceType;
  sourceUrl?: string;
  sourceMetadata?: Record<string, unknown>;
}

export class ProductPersistenceService {
  private static productService = new ProductService();

  /**
   * Grava ou atualiza um produto no PostgreSQL de forma atômica via prisma.$transaction().
   */
  public static async upsertProduct(input: NormalizedProductInput, options: PersistOptions = {}) {
    const opportunityScore = this.productService.calculateOpportunityScore({
      externalId: input.externalId,
      platformSlug: input.affiliatePlatformId,
      title: input.title,
      description: input.description,
      url: input.url,
      imageUrl: input.imageUrl,
      category: input.category,
      currentPrice: input.currentPrice,
      previousPrice: input.previousPrice,
      currency: input.currency || 'BRL',
      rating: input.rating,
      commissionRate: input.commissionRate,
    });

    const sourceType = options.sourceType || 'API';
    const sourceMetadata = options.sourceMetadata ? (options.sourceMetadata as any) : undefined;

    return await prisma.$transaction(async (tx) => {
      const product = await tx.product.upsert({
        where: {
          affiliatePlatformId_externalId: {
            affiliatePlatformId: input.affiliatePlatformId,
            externalId: input.externalId,
          },
        },
        update: {
          title: input.title,
          description: input.description,
          url: input.url,
          imageUrl: input.imageUrl,
          category: input.category,
          brand: input.brand,
          currentPrice: input.currentPrice,
          previousPrice: input.previousPrice,
          currency: input.currency || 'BRL',
          rating: input.rating,
          reviewCount: input.reviewCount || 0,
          availability: input.availability,
          commissionRate: input.commissionRate,
          estimatedCommission: input.estimatedCommission,
          opportunityScore,
          sourceType,
          sourceUrl: options.sourceUrl || input.url,
          sourceMetadata,
          lastSyncedAt: new Date(),
        },
        create: {
          externalId: input.externalId,
          affiliatePlatformId: input.affiliatePlatformId,
          title: input.title,
          description: input.description,
          url: input.url,
          imageUrl: input.imageUrl,
          category: input.category,
          brand: input.brand,
          currentPrice: input.currentPrice,
          previousPrice: input.previousPrice,
          currency: input.currency || 'BRL',
          rating: input.rating,
          reviewCount: input.reviewCount || 0,
          availability: input.availability,
          commissionRate: input.commissionRate,
          estimatedCommission: input.estimatedCommission,
          opportunityScore,
          sourceType,
          sourceUrl: options.sourceUrl || input.url,
          sourceMetadata,
          collectedAt: new Date(),
          lastSyncedAt: new Date(),
        },
      });

      // Gravar histórico de preços condicionalmente
      await ProductPriceHistoryService.recordPriceHistoryIfChanged(
        product.id,
        product.currentPrice,
        product.previousPrice || undefined,
        product.currency,
        product.availability,
        sourceType
      );

      Logger.info('PERSISTENCE', 'UPSERT_SUCCESS', `Produto ${product.externalId} salvo/atualizado com sucesso.`);
      return product;
    });
  }
}
