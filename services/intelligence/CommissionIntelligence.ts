import { prisma } from '../../lib/prisma';
import { Logger } from '../../lib/logger';

export class CommissionIntelligence {
  /**
   * Calcula o EPC global ou para um canal/produto específico
   */
  public static async calculateEPC(filters?: { channelId?: string; productId?: string; marketplace?: string }) {
    try {
      // Build filters
      const clickWhere: any = {};
      const commissionWhere: any = {};

      if (filters?.channelId) {
        clickWhere.channelId = filters.channelId;
        commissionWhere.conversion = { channelId: filters.channelId };
      }
      if (filters?.productId) {
        clickWhere.productId = filters.productId;
        commissionWhere.conversion = { ...commissionWhere.conversion, productId: filters.productId };
      }
      if (filters?.marketplace) {
        clickWhere.marketplace = filters.marketplace;
        // Marketplace on commission is derived from affiliatePlatformId on product, 
        // but for simplicity we rely on click context if needed, or join
      }

      const totalClicks = await prisma.clickEvent.count({
        where: clickWhere
      });

      if (totalClicks === 0) return 0;

      const totalRevenueAgg = await prisma.commission.aggregate({
        _sum: {
          amount: true
        },
        where: {
          status: 'APPROVED',
          ...commissionWhere
        }
      });

      const totalRevenue = totalRevenueAgg._sum.amount || 0;
      
      const epc = totalRevenue / totalClicks;
      return epc;
    } catch (error: any) {
      Logger.error('COMMISSION_INTELLIGENCE', 'EPC_CALC_FAILED', `Falha ao calcular EPC: ${error.message}`);
      return 0;
    }
  }

  /**
   * Retorna um ranking de produtos baseado no EPC histórico
   */
  public static async getProductRankingByEPC(limit = 10) {
    try {
      // Para ranking otimizado em produção real isso deve ser uma materialized view,
      // mas para implementação inicial faremos a sumarização
      
      // Agrupa comissões por produto e soma
      const commissions = await prisma.commission.groupBy({
        by: ['conversionId'], // Needs join to get productId. We can fetch raw or use conversion
        _sum: { amount: true },
        where: { status: 'APPROVED' }
      });
      // Uma implementação melhor é buscar os produtos e iterar, ou usar query raw
      const rawRanking = await prisma.$queryRaw`
        SELECT 
          p.id as "productId", 
          p.title as "productTitle",
          COUNT(DISTINCT ce.id) as "totalClicks",
          COALESCE(SUM(c.amount), 0) as "totalRevenue",
          (COALESCE(SUM(c.amount), 0) / NULLIF(COUNT(DISTINCT ce.id), 0)) as "epc"
        FROM "Product" p
        LEFT JOIN "ClickEvent" ce ON p.id = ce."productId"
        LEFT JOIN "Conversion" conv ON p.id = conv."productId"
        LEFT JOIN "Commission" c ON conv.id = c."conversionId" AND c.status = 'APPROVED'
        GROUP BY p.id
        HAVING COUNT(DISTINCT ce.id) > 0
        ORDER BY "epc" DESC
        LIMIT ${limit};
      `;

      return rawRanking;
    } catch (error: any) {
      Logger.error('COMMISSION_INTELLIGENCE', 'RANKING_FAILED', `Falha ao gerar ranking EPC: ${error.message}`);
      return [];
    }
  }
}
