import { NextResponse } from 'next/server';
import { AutonomousIntelligenceEngine } from '../../../../../services/intelligence/AutonomousIntelligenceEngine';

const aie = new AutonomousIntelligenceEngine();

export async function GET() {
  const opportunities = [
    aie.opportunityEngine.detectOpportunity('Amazon Tech Gadgets US', 'US_MARKET', 4500, 0.045, 18.5, 12),
    aie.opportunityEngine.detectOpportunity('Mercado Livre Home BR', 'BR_MARKET', 3200, 0.052, 14.2, 10)
  ];

  return NextResponse.json({ success: true, data: opportunities });
}
