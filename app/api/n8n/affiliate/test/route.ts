import { NextRequest, NextResponse } from 'next/server';
import { AffiliateConnectionService } from '@/services/affiliate/AffiliateConnectionService';

export async function POST(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-n8n-api-key');
  const configuredApiKey = process.env.N8N_API_KEY || 'n8n_secret_autopilot_key_2026';

  if (!apiKeyHeader || apiKeyHeader !== configuredApiKey) {
    return NextResponse.json({ success: false, error: 'Não autorizado: Chave de API n8n inválida ou ausente.' }, { status: 401 });
  }

  try {
    const { accountId } = await req.json();
    if (!accountId) {
      return NextResponse.json({ success: false, error: 'O campo accountId é obrigatório.' }, { status: 400 });
    }

    const result = await AffiliateConnectionService.testAccountConnection(accountId);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode || 400 });
  }
}
