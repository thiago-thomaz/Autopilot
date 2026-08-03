import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const result = await prisma.product.updateMany({
      where: { externalId: 'B07XQ8P6S1' },
      data: { externalId: 'B077BG228H' }
    });
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
