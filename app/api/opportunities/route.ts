import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classification = searchParams.get('classification');
    const minScore = searchParams.get('minScore');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const where: any = {};
    if (classification) where.classification = classification;
    if (minScore) where.score = { gte: parseFloat(minScore) };

    const snapshots = await prisma.opportunitySnapshot.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        product: {
          include: { affiliatePlatform: true },
        },
      },
    });

    return NextResponse.json({ success: true, count: snapshots.length, snapshots });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
