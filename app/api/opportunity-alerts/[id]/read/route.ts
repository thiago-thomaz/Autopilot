import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const alert = await prisma.opportunityAlert.update({
      where: { id: params.id },
      data: { status: 'READ' },
    });
    return NextResponse.json({ success: true, alert });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
