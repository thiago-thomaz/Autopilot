import { NextRequest, NextResponse } from 'next/server';
import { PerformanceEngine } from '@/services/analytics/PerformanceEngine';

export async function POST(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-n8n-api-key');
  const configuredApiKey = process.env.N8N_API_KEY || 'n8n_secret_autopilot_key_2026';

  if (!apiKeyHeader || apiKeyHeader !== configuredApiKey) {
    return NextResponse.json({ success: false, error: 'Não autorizado: Chave de API n8n (x-n8n-api-key) inválida.' }, { status: 401 });
  }

  try {
    const result = await PerformanceEngine.aggregateDailyPerformance();
    return NextResponse.json({ success: true, dailyAggregate: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
