import { NextResponse } from 'next/server';
import { AutonomousIntelligenceEngine } from '../../../../../services/intelligence/AutonomousIntelligenceEngine';

const aie = new AutonomousIntelligenceEngine();

export async function GET() {
  const risks = [
    aie.riskEngine.evaluateRisk('FINANCIAL', 'Ad spend surge without CVR lift', 0.25, 0.6),
    aie.riskEngine.evaluateRisk('CONCENTRATION', 'US market revenue share > 50%', 0.55, 0.7)
  ];

  return NextResponse.json({ success: true, data: risks });
}
