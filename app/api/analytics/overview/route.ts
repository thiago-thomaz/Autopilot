import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MetricsEngine } from '@/services/analytics/MetricsEngine';
import { ProfitEngine } from '@/services/analytics/ProfitEngine';
import { InsightEngine } from '@/services/analytics/InsightEngine';

export async function GET() {
  try {
    const totalClicks = await prisma.analyticsClick.count();
    const validClicks = await prisma.analyticsClick.count({ where: { status: 'VALID' } });
    const conversions = await prisma.analyticsConversion.count();
    const sales = await prisma.saleRecord.count();

    const commissions = await prisma.commissionRecord.aggregate({ _sum: { amount: true } });
    const commissionRevenue = Number(commissions._sum.amount || 0);

    const costs = await prisma.costRecord.aggregate({ _sum: { amount: true } });
    const totalCosts = Number(costs._sum.amount || 0);

    const { netProfit, roi } = ProfitEngine.calculateProfitAndROI(commissionRevenue, totalCosts);
    const { ctr, cvr, epc } = MetricsEngine.calculateKPIs(1000, validClicks, conversions, commissionRevenue);

    const insights = InsightEngine.generateNaturalLanguageInsights(commissionRevenue, totalCosts, netProfit, roi);

    return NextResponse.json({
      success: true,
      overview: {
        totalClicks,
        validClicks,
        conversions,
        sales,
        commissionRevenue,
        totalCosts,
        netProfit,
        roi,
        ctr,
        cvr,
        epc,
        baseCurrency: 'BRL',
      },
      insights,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
