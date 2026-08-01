import { NextRequest, NextResponse } from 'next/server';
import { ContentEngine } from '@/services/content/ContentEngine';

export async function POST(req: NextRequest) {
  const apiKeyHeader = req.headers.get('x-n8n-api-key');
  const configuredApiKey = process.env.N8N_API_KEY || 'n8n_secret_autopilot_key_2026';

  if (!apiKeyHeader || apiKeyHeader !== configuredApiKey) {
    return NextResponse.json({ success: false, error: 'Não autorizado: Chave de API n8n (x-n8n-api-key) inválida.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { productId, angle, channel, contentType } = body;

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Campo productId é obrigatório.' }, { status: 400 });
    }

    const result = await ContentEngine.generateContentPackage(
      productId,
      angle,
      channel || 'INSTAGRAM',
      contentType || 'SOCIAL_POST'
    );

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, code: error.code }, { status: error.statusCode || 400 });
  }
}
