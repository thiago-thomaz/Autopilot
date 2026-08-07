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
      } catch (err: any) {
        console.error(`Erro ao gerar pacote para o produto ${id}:`, err);
      }
    }

    // Auto-enqueue the generated packages to be published to Telegram
    const { PublicationPlanner } = require('../publication/PublicationPlanner');
    for (const pkgRes of generatedPackages) {
      if (pkgRes.package && (pkgRes.package.status === 'READY_FOR_PUBLICATION' || pkgRes.package.status === 'REVIEW_REQUIRED')) {
        try {
          // Force status to READY_FOR_PUBLICATION for autopilot testing
          await prisma.contentPackage.update({
            where: { id: pkgRes.package.id },
            data: { status: 'READY_FOR_PUBLICATION' }
          });
          await PublicationPlanner.createPlan({
            contentPackageId: pkgRes.package.id,
            channels: ['TELEGRAM'], // Override default to target Telegram specifically
            targetCountries: ['BR']
          });
        } catch(e) {
          console.error(`Falha ao enfileirar pacote ${pkgRes.package.id}:`, e);
        }
      }
    }

    return {
      success: true,
      count: generatedPackages.length,
      packages: generatedPackages,
    };
  }
}
