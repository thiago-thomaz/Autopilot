export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { inMemoryProducts } from '@/services/discovery/ProductPersistenceService';

export async function GET() {
  try {
    let productsCount = 0;
    let opportunitiesCount = 0;
    let contentsCount = 0;
    let publicationsCount = 0;
    let clicksCount = 0;
    let conversionsCount = 0;
    let totalCommissions = 0;
    let totalRevenue = 0;
    let recentLogs: any[] = [];

    try {
      productsCount = await prisma.product.count();
      opportunitiesCount = await prisma.product.count({
        where: { opportunityScore: { gte: 70 } }
      });
      contentsCount = await prisma.contentPackage.count();
      publicationsCount = await prisma.publicationRecord.count();
      clicksCount = await prisma.clickEvent.count();
      conversionsCount = await prisma.conversion.count();
      
      const commAgg = await prisma.commission.aggregate({
        _sum: { amount: true },
      });
      totalCommissions = commAgg._sum.amount || 0;
      totalRevenue = totalCommissions * 12.5; // Estimativa de GMV proporcional

      recentLogs = await prisma.systemLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr) {
      productsCount = inMemoryProducts.length;
      opportunitiesCount = inMemoryProducts.filter((p: any) => (p.opportunityScore || 0) >= 70).length;
    }

    return NextResponse.json({
      success: true,
      metrics: {
        products: productsCount,
        offers: opportunitiesCount,
        contents: contentsCount,
        publications: publicationsCount,
        clicks: clicksCount,
        conversions: conversionsCount,
        commissions: `R$ ${totalCommissions.toFixed(2).replace('.', ',')}`,
        revenue: `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`,
      },
      recentLogs,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
