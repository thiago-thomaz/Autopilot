import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get('secret');

  if (secret !== 'autopilot-cleanup-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = [];
    
    const r1 = await prisma.$executeRawUnsafe(`
      DELETE FROM "Product"
      WHERE
        "externalId" IN ('B092DC27PN', 'B07NRR739V', 'B08FCMK8LN', 'B073VTVS44')
        OR "sourceType" = 'MOCK'
    `);
    results.push({ q: 'Delete mock products', rows: r1 });

    const r2 = await prisma.$executeRawUnsafe(`
      DELETE FROM "Product"
      WHERE
        "url" LIKE '%tag=demo-20%'
        OR "url" LIKE '%tag=meutagafiliado-20%'
        OR "url" LIKE '%tag=ml_afiliado_%'
    `);
    results.push({ q: 'Delete test urls', rows: r2 });

    const r3 = await prisma.$executeRawUnsafe(`
      UPDATE "Product"
      SET
        "url" = regexp_replace("url", 'tag=demo-20', 'tag=thomazpromos-20', 'g'),
        "updatedAt" = NOW()
      WHERE
        "url" LIKE '%tag=demo-20%'
        AND "url" LIKE '%amazon.com.br%'
    `);
    results.push({ q: 'Update remaining urls', rows: r3 });

    const r4 = await prisma.$executeRawUnsafe(`
      DELETE FROM "OpportunitySnapshot"
      WHERE "productId" NOT IN (SELECT "id" FROM "Product")
    `);
    results.push({ q: 'Delete orphan snapshots', rows: r4 });

    return NextResponse.json({ message: 'Limpeza executada', results });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro', details: error.message }, { status: 500 });
  }
}
