import { prisma } from '../../lib/prisma';
import { MetricsEngine } from './MetricsEngine';

export class PerformanceEngine {
  public static async aggregateDailyPerformance(date = new Date()) {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const clicksCount = await prisma.analyticsClick.count({
      where: { timestamp: { gte: startOfDay, lte: endOfDay } },
    });

    const conversionsCount = await prisma.analyticsConversion.count({
      where: { timestamp: { gte: startOfDay, lte: endOfDay } },
    });

    const commissions = await prisma.commissionRecord.aggregate({
      where: { createdAt: { gte: startOfDay, lte: endOfDay } },
      _sum: { amount: true },
    });

    const commissionRevenue = Number(commissions._sum.amount || 0);
    const costs = await prisma.costRecord.aggregate({
      where: { date: { gte: startOfDay, lte: endOfDay } },
      _sum: { amount: true },
    });
    const totalCost = Number(costs._sum.amount || 0);
    const netProfit = commissionRevenue - totalCost;

    const { ctr, cvr, epc } = MetricsEngine.calculateKPIs(100, clicksCount, conversionsCount, commissionRevenue);

    return await prisma.dailyPerformance.create({
      data: {
        date: startOfDay,
        channel: 'ALL',
        platform: 'ALL',
        impressions: 100,
        clicks: clicksCount,
        validClicks: clicksCount,
        conversions: conversionsCount,
        commissionRevenue,
        cost: totalCost,
        netProfit,
        ctr,
        cvr,
        epc,
      },
    });
  }
}
