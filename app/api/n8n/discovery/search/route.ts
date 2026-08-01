import { NextRequest, NextResponse } from 'next/server';
import { ProductDiscoveryService } from '@/services/discovery/ProductDiscoveryService';

export async function POST(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-n8n-api-key');
  const configuredApiKey = process.env.N8N_API_KEY || 'n8n_secret_autopilot_key_2026';

  if (!apiKeyHeader || apiKeyHeader !== configuredApiKey) {
    return NextResponse.json({ success: false, error: 'Não autorizado: Chave de API n8n (x-n8n-api-key) inválida.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = await ProductDiscoveryService.discoverProducts(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, code: error.code }, { status: error.statusCode || 400 });
  }
}
