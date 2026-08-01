import { NextResponse } from 'next/server';
import { AutonomousIntelligenceEngine } from '../../../../../services/intelligence/AutonomousIntelligenceEngine';

const aie = new AutonomousIntelligenceEngine();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const outcome = aie.outcomeEngine.evaluateOutcome(
      body.decisionId || 'dec_sample',
      Number(body.expectedNetProfit) || 1000,
      Number(body.actualNetProfit) || 950
    );
    return NextResponse.json({ success: true, data: outcome });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
