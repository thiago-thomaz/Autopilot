import { ContentEngine } from './ContentEngine';
import { prisma } from '../../lib/prisma';

export class CopywritingService {
  /**
   * Gera copies para ofertas pendentes de postagem.
   */
  public static async generatePostsForPendingDeals(deals: any[]) {
    let productIds = [];
    if (deals && deals.length > 0) {
      productIds = deals.map((d: any) => d.id || d.productId || d.externalId).filter(Boolean);
    }

    if (productIds.length === 0) {
      const topProducts = await prisma.product.findMany({
        where: { opportunityScore: { gte: 70 } },
        take: 10,
        orderBy: { opportunityScore: 'desc' },
        select: { id: true },
      });
      productIds = topProducts.map((p) => p.id);
    }

    const generatedPackages = [];
    for (const id of productIds) {
      try {
        const res = await ContentEngine.generatePackageVariations(id);
        generatedPackages.push(...res);
      } catch (err) {
        // Ignora erros individuais de geração
      }
    }

    return {
      success: true,
      count: generatedPackages.length,
      packages: generatedPackages,
    };
  }
}
