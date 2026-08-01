import { NextResponse } from 'next/server';
import { AutonomousIntelligenceEngine } from '../../../../../services/intelligence/AutonomousIntelligenceEngine';

const aie = new AutonomousIntelligenceEngine();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const outcome = aie.outcomeEngine.evaluateOutcome(body.decisionId, body.expectedNetProfit || 500, body.actualNetProfit || 480);
    const learning = aie.learningEngine.processLearning(outcome);

    return NextResponse.json({ success: true, data: { outcome, learning } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
