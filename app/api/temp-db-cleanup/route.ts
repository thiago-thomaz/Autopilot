import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await prisma.product.updateMany({
      where: {
        OR: [
          { url: { contains: 'ASIN123' } },
          { url: { contains: '/dp/B07XQ8P6S1' } },
          { url: { contains: '/dp/B07MSLFF61' } }
        ]
      },
      data: {
        url: ''
      }
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
