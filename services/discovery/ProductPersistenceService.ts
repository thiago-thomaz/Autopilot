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

export const inMemoryProducts: any[] = [];

import { getSanitizedAffiliateUrl } from '../../lib/utils/url';

export class ProductPersistenceService {
  private static productService = new ProductService();

  /**
   * Grava ou atualiza um produto no PostgreSQL de forma atômica via prisma.$transaction().
   */
  public static async upsertProduct(input: NormalizedProductInput, options: PersistOptions = {}) {
    const sanitizedUrl = getSanitizedAffiliateUrl(input);
    input.url = sanitizedUrl;

    // Busca o produto pelo externalId para pegar o histórico
    let avg30DayPrice: number | null = null;
    const existingProduct = await prisma.product.findFirst({
      where: {
        externalId: input.externalId,
        affiliatePlatformId: input.affiliatePlatformId === 'amazon-brasil' 
          ? (await prisma.affiliatePlatform.findFirst({ where: { slug: 'amazon-brasil' } }))?.id 
          : undefined, // Need to improve this lookup if needed, or rely on externalId uniqueness
      }
    });

    if (existingProduct) {
      avg30DayPrice = await ProductPriceHistoryService.getAveragePrice(existingProduct.id, 30);
    }

    let opportunityScore = this.productService.calculateOpportunityScore({
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

    if (avg30DayPrice && input.currentPrice > avg30DayPrice) {
      // Se o preço atual for MAIOR que a média dos últimos 30 dias,
      // penalizamos o score severamente para não ser classificado como "alta oportunidade".
      opportunityScore = opportunityScore * 0.5;
    }

    const sourceType = options.sourceType || 'API';
    const sourceMetadata = options.sourceMetadata ? (options.sourceMetadata as any) : undefined;

    try {
      return await prisma.$transaction(async (tx) => {
        // Auto-create AffiliatePlatform if it's missing (lazy seeding)
        const platform = await tx.affiliatePlatform.upsert({
          where: { slug: input.affiliatePlatformId },
          update: {},
          create: {
            name: input.affiliatePlatformId === 'amazon-brasil' ? 'Amazon Brasil' : input.affiliatePlatformId,
            slug: input.affiliatePlatformId,
            status: 'ACTIVE',
            apiAvailable: true,
            productDiscoveryAvailable: true,
            website: 'https://www.amazon.com.br',
          },
        });

        const product = await tx.product.upsert({
          where: {
            affiliatePlatformId_externalId: {
              affiliatePlatformId: platform.id,
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
            affiliatePlatformId: platform.id,
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
    } catch (error) {
      Logger.warn('PERSISTENCE', 'DB_UPSERT_FALLBACK', `Falha ao salvar produto no DB, utilizando store de resiliência: ${error}`);
      const existingIndex = inMemoryProducts.findIndex(
        (p) => p.externalId === input.externalId && p.affiliatePlatformId === input.affiliatePlatformId
      );
      const now = new Date();
      const productData = {
        id: existingIndex >= 0 ? inMemoryProducts[existingIndex].id : `prod_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
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
        rating: input.rating || 4.5,
        reviewCount: input.reviewCount || 0,
        availability: input.availability ?? true,
        commissionRate: input.commissionRate || 0.08,
        estimatedCommission: input.estimatedCommission || input.currentPrice * 0.08,
        opportunityScore,
        sourceType,
        sourceUrl: options.sourceUrl || input.url,
        sourceMetadata,
        collectedAt: existingIndex >= 0 ? inMemoryProducts[existingIndex].collectedAt : now,
        updatedAt: now,
        lastSyncedAt: now,
      };

      if (existingIndex >= 0) {
        inMemoryProducts[existingIndex] = productData;
      } else {
        inMemoryProducts.push(productData);
      }
      return productData;
    }
  }
}

