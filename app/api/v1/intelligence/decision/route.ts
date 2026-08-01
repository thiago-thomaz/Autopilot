import { NextResponse } from 'next/server';
import { AutonomousIntelligenceEngine } from '../../../../../services/intelligence/AutonomousIntelligenceEngine';

const aie = new AutonomousIntelligenceEngine();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await aie.processSignal({
      eventType: 'DECISION_CREATED',
      sourceModule: body.sourceModule || 'n8n',
      entityType: body.entityType || 'CAMPAIGN',
      entityId: body.entityId || 'cmp_growth_001',
      payload: body
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
