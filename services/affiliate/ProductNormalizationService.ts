import { NormalizedProductInput } from './types/affiliate.types';
import { ProductService } from '../products';
import { prisma } from '@/lib/prisma';
import { Logger } from '@/lib/logger';

export class ProductNormalizationService {
  private static productService = new ProductService();

  /**
   * Converte e enriquece o produto de entrada para gravação/atualização idempotente no banco.
   * Chave única composta: affiliatePlatformId + externalId.
   */
  public static async saveOrUpdateNormalizedProduct(input: NormalizedProductInput) {
    try {
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

      const product = await prisma.product.upsert({
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
          lastSyncedAt: new Date(),
        },
      });

      Logger.info(
        'PRODUCT_NORMALIZATION',
        'PRODUCT_SAVED',
        `Produto '${product.title}' (${product.externalId}) salvo/atualizado com sucesso.`,
        { productId: product.id, opportunityScore }
      );

      return product;
    } catch (error: any) {
      Logger.error('PRODUCT_NORMALIZATION', 'SAVE_FAILED', `Falha ao salvar produto normalizado ${input.externalId}.`, {
        error: error.message,
      });
      throw error;
    }
  }
}
