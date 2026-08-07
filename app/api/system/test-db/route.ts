import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import dns from 'dns/promises';

export async function GET() {
  try {
    let dnsResults: any = {};
    for (const host of ['postgres', 'db', 'localhost', 'postgres-i9mhxq0rhwwxnp7071x1wvoz']) {
      try {
        const res = await dns.lookup(host);
        dnsResults[host] = res.address;
      } catch (e) {
        dnsResults[host] = 'failed';
      }
    }

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
    return NextResponse.json({ success: true, result, platform, url: process.env.DATABASE_URL, dns: dnsResults });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack, url: process.env.DATABASE_URL, dns: dnsResults });
  }
}
