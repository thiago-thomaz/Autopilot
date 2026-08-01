import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest, { params }: { params: { platform: string } }) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-hub-signature-256') || req.headers.get('x-signature');
    const secret = process.env.WEBHOOK_SECRET || 'secret_autopilot_webhook_key';

    if (signature) {
      const expectedSignature = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
      if (signature !== expectedSignature) {
        return NextResponse.json({ success: false, error: 'Assinatura HMAC inválida.' }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody || '{}');
    return NextResponse.json({ success: true, platform: params.platform, receivedEvent: event });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
