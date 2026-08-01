import { NextResponse } from 'next/server';
import { AutonomousIntelligenceEngine } from '../../../../../services/intelligence/AutonomousIntelligenceEngine';

const aie = new AutonomousIntelligenceEngine();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await aie.processSignal({
      eventType: body.eventType || 'SIGNAL_RECEIVED',
      sourceModule: body.sourceModule || 'n8n',
      entityType: body.entityType || 'PRODUCT',
      entityId: body.entityId || 'prod_123',
      payload: body.payload || {}
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
