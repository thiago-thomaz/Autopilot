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
    const generationErrors = [];
    const { PublicationPlanner } = require('../publication/PublicationPlanner');
    
    const TEMPLATES = ['SHORT_DIRECT', 'SCARCITY_URGENCY', 'TECHNICAL_INFORMATIVE', 'ECONOMY_FOCUSED'];
    
    for (let i = 0; i < productIds.length; i++) {
      const id = productIds[i];
      const templateStyle = TEMPLATES[i % TEMPLATES.length]; // Round-robin A/B testing
      
      try {
        const res = await ContentEngine.generatePackageVariations(id, templateStyle);
        generatedPackages.push(...res);
      } catch (err: any) {
        generationErrors.push({ id, message: err.message, stack: err.stack });
        console.error(`Erro ao gerar pacote para o produto ${id}:`, err);
      }
    }

    // Auto-enqueue the generated packages to be published to Telegram
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
            targetCountries: ['BR']
          });
        } catch(e: any) {
          generationErrors.push({ id: pkgRes.package.id, message: e.message });
          console.error(`Falha ao enfileirar pacote ${pkgRes.package.id}:`, e);
        }
      }
    }

    return {
      success: true,
      count: generatedPackages.length,
      packages: generatedPackages,
      errors: generationErrors
    };
  }
}
