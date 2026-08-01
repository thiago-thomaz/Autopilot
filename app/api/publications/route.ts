import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country');
    const channel = searchParams.get('channel');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const where: any = {};
    if (country) where.country = country;
    if (channel) where.channel = channel;
    if (status) where.status = status;

    const publications = await prisma.publicationRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        contentPackage: { include: { product: true } },
      },
    });

    return NextResponse.json({ success: true, count: publications.length, publications });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
