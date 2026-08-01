import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ContentEngine } from '@/services/content/ContentEngine';

export async function POST(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-n8n-api-key');
  const configuredApiKey = process.env.N8N_API_KEY || 'n8n_secret_autopilot_key_2026';

  if (!apiKeyHeader || apiKeyHeader !== configuredApiKey) {
    return NextResponse.json({ success: false, error: 'Não autorizado: Chave de API n8n (x-n8n-api-key) inválida.' }, { status: 401 });
  }

  try {
    const { limit, minOpportunityScore } = await req.json().catch(() => ({ limit: 10, minOpportunityScore: 70 }));

    const topProducts = await prisma.product.findMany({
      where: { opportunityScore: { gte: minOpportunityScore || 70 } },
      take: limit || 10,
      orderBy: { opportunityScore: 'desc' },
      select: { id: true },
    });

    const generatedPackages = [];
    for (const p of topProducts) {
      const res = await ContentEngine.generatePackageVariations(p.id);
      generatedPackages.push(...res);
    }

    return NextResponse.json({ success: true, count: generatedPackages.length, packages: generatedPackages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
