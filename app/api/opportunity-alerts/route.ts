import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'UNREAD';

    const alerts = await prisma.opportunityAlert.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        product: true,
      },
    });

    return NextResponse.json({ success: true, count: alerts.length, alerts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
