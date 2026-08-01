import { prisma } from '../../lib/prisma';

export class OpportunityRankingService {
  /**
   * Consulta os produtos com melhores oportunidades ordenados por `adjustedOpportunityScore` ou `score`.
   */
  public static async getTopOpportunities(limit = 20, minScore = 40) {
    try {
      const products = await prisma.product.findMany({
        where: {
          opportunityScore: { gte: minScore },
        },
        orderBy: { opportunityScore: 'desc' },
        take: limit,
        include: {
          affiliatePlatform: true,
          opportunitySnapshots: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });

      return products;
    } catch {
      return [];
    }
  }
}
