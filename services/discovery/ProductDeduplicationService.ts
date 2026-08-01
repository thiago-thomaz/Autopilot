import { NormalizedProductInput } from '../affiliate/types/affiliate.types';
import { prisma } from '../../lib/prisma';

export class ProductDeduplicationService {
  /**
   * Remove duplicatas primárias dentro do lote (mesmo externalId) e marca possíveis duplicatas por ASIN/EAN.
   */
  public static async deduplicateBatch(
    platformId: string,
    products: NormalizedProductInput[]
  ): Promise<{ uniqueProducts: NormalizedProductInput[]; duplicateCount: number }> {
    const seenExternalIds = new Set<string>();
    const uniqueProducts: NormalizedProductInput[] = [];
    let duplicateCount = 0;

    for (const prod of products) {
      if (seenExternalIds.has(prod.externalId)) {
        duplicateCount++;
        continue;
      }
      seenExternalIds.add(prod.externalId);
      uniqueProducts.push(prod);
    }

    return { uniqueProducts, duplicateCount };
  }

  /**
   * Verifica se o produto já existe no banco de dados.
   */
  public static async isExistingProduct(platformId: string, externalId: string): Promise<boolean> {
    try {
      const existing = await prisma.product.findUnique({
        where: {
          affiliatePlatformId_externalId: {
            affiliatePlatformId: platformId,
            externalId,
          },
        },
        select: { id: true },
      });
      return !!existing;
    } catch {
      return false;
    }
  }
}
