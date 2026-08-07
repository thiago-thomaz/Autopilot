import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    const platform = await prisma.affiliatePlatform.upsert({
          where: { slug: 'amazon-brasil' },
          update: {},
          create: {
            name: 'Amazon Brasil',
            slug: 'amazon-brasil',
            status: 'ACTIVE',
            apiAvailable: true,
            productDiscoveryAvailable: true,
            website: 'https://www.amazon.com.br',
          },
        });
    return NextResponse.json({ success: true, result, platform });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack });
  }
}
