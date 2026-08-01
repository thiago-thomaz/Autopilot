import { NextResponse } from 'next/server';
import { AutonomousIntelligenceEngine } from '../../../../../services/intelligence/AutonomousIntelligenceEngine';

const aie = new AutonomousIntelligenceEngine();

export async function GET() {
  const financialState = aie.m12Adapter.getFinancialState();
  const state = aie.contextEngine.buildContext(financialState, [], {}, {}, aie.autonomyMode);
  return NextResponse.json({ success: true, data: state });
}
