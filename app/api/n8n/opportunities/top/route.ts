import { NextRequest, NextResponse } from 'next/server';
import { OpportunityRankingService } from '@/services/opportunity/OpportunityRankingService';

export async function POST(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-n8n-api-key');
  const configuredApiKey = process.env.N8N_API_KEY || 'n8n_secret_autopilot_key_2026';

  if (!apiKeyHeader || apiKeyHeader !== configuredApiKey) {
    return NextResponse.json({ success: false, error: 'Não autorizado: Chave de API n8n (x-n8n-api-key) inválida.' }, { status: 401 });
  }

  try {
    const { limit, minScore } = await req.json().catch(() => ({ limit: 10, minScore: 40 }));
    const products = await OpportunityRankingService.getTopOpportunities(limit || 10, minScore || 40);
    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
