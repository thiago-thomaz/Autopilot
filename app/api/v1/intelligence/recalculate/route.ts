import { NextResponse } from 'next/server';
import { AutonomousIntelligenceEngine } from '../../../../../services/intelligence/AutonomousIntelligenceEngine';

const aie = new AutonomousIntelligenceEngine();

export async function POST() {
  const result = await aie.processSignal({
    eventType: 'SIGNAL_RECEIVED',
    sourceModule: 'M13_RECALCULATE',
    entityType: 'PORTFOLIO',
    entityId: 'global',
    payload: { action: 'FORCE_RECALCULATE' }
  });
  return NextResponse.json({ success: true, data: result });
}
