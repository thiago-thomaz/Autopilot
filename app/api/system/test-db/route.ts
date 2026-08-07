import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import dns from 'dns/promises';

export const dynamic = 'force-dynamic';

export async function GET() {
  let dnsResults: any = {};
  try {
    for (const host of ['postgres', 'db', 'localhost', 'postgres-i9mhxq0rhwwxnp7071x1wvoz']) {
      try {
        const res = await dns.lookup(host);
        dnsResults[host] = res.address;
      } catch (e) {
        dnsResults[host] = 'failed';
      }
    }

    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    let upsertError = null;
    try {
      await prisma.product.upsert({
          where: {
            affiliatePlatformId_externalId: {
              affiliatePlatformId: 'amazon-brasil',
              externalId: 'test1234',
            },
          },
          update: {},
          create: {
            externalId: 'test1234',
            affiliatePlatformId: 'amazon-brasil',
            title: 'Test',
            url: 'http://test.com',
            category: 'test',
            currentPrice: 10,
            currency: 'BRL',
            availability: true,
            sourceType: 'API',
            opportunityScore: 10
          },
        });
    } catch(e: any) {
      upsertError = e.message;
    }
    return NextResponse.json({ success: true, result, upsertError, url: process.env.DATABASE_URL, dns: dnsResults });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack, url: process.env.DATABASE_URL, dns: dnsResults });
  }
}
