import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProfitEngine } from '@/services/analytics/ProfitEngine';

export async function GET() {
  try {
    const profitRecords = await prisma.profitRecord.findMany({
      orderBy: { date: 'desc' },
      take: 30,
    });

    const commissions = await prisma.commissionRecord.aggregate({ _sum: { amount: true } });
    const totalRevenue = Number(commissions._sum.amount || 0);

    const costs = await prisma.costRecord.aggregate({ _sum: { amount: true } });
    const totalCost = Number(costs._sum.amount || 0);

    const { netProfit, roi } = ProfitEngine.calculateProfitAndROI(totalRevenue, totalCost);

    return NextResponse.json({
      success: true,
      profitSummary: {
        totalRevenue,
        totalCost,
        netProfit,
        roi,
        currency: 'BRL',
      },
      history: profitRecords,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
