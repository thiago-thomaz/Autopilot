import { prisma } from '../../lib/prisma';
import { RevenueEngine } from './RevenueEngine';
import { ProfitEngine } from './ProfitEngine';

export class AnalyticsPersistenceService {
  /**
   * Registra o resumo diário de receita, custos e lucro no banco via transação Prisma.
   */
  public static async recordDailySummary(date = new Date(), commissionAmount: number, costAmount: number, currency = 'BRL') {
    const commissionRevenue = RevenueEngine.calculateCommissionRevenue(commissionAmount, currency);
    const { netProfit, roi } = ProfitEngine.calculateProfitAndROI(commissionRevenue, costAmount);

    return await prisma.profitRecord.create({
      data: {
        date,
        currency,
        grossRevenue: commissionAmount,
        commissionRevenue,
        cost: costAmount,
        profit: netProfit,
        roi,
      },
    });
  }
}
