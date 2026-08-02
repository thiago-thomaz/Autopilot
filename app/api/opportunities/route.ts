import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { inMemorySnapshots } from '@/services/opportunity/OpportunityPersistenceService';
import { inMemoryProducts } from '@/services/discovery/ProductPersistenceService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classification = searchParams.get('classification');
    const minScore = searchParams.get('minScore');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let snapshots: any[] = [];
    try {
      const where: any = {};
      if (classification) where.classification = classification;
      if (minScore) where.score = { gte: parseFloat(minScore) };

      snapshots = await prisma.opportunitySnapshot.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          product: {
            include: { affiliatePlatform: true },
          },
        },
      });
    } catch {
      // DB offline fallback
    }

    if (snapshots.length === 0 && inMemorySnapshots.length > 0) {
      let filtered = [...inMemorySnapshots];
      if (classification) filtered = filtered.filter((s) => s.classification === classification);
      if (minScore) filtered = filtered.filter((s) => s.score >= parseFloat(minScore));

      snapshots = filtered.slice(0, limit).map((snap) => {
        const prod = inMemoryProducts.find((p) => p.id === snap.productId) || {
          title: 'Produto Monitorado',
          externalId: snap.productId,
          currentPrice: 99.9,
          affiliatePlatform: { name: 'Amazon Brasil', slug: 'amazon-brasil' },
        };
        return {
          ...snap,
          product: prod,
        };
      });
    }

    return NextResponse.json({ success: true, count: snapshots.length, snapshots });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
