import { NextResponse } from 'next/server';
import { AutonomousGrowthEngine } from '../../../../../../services/growth/AutonomousGrowthEngine';

const engine = new AutonomousGrowthEngine();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json().catch(() => ({ scalePercentage: 10 }));
    const scalePercentage = body.scalePercentage || 10;

    const decision = engine.decisionEngine.evaluateTacticalDecision({
      campaignId: id,
      currentBudget: 100,
      rolling7DayROI: 35,
      rolling7DayNetProfit: 150,
      previous7DayROI: 30,
      consecutiveProfitableDays: 7,
      healthScore: 90
    });

    return NextResponse.json({
      success: true,
      data: {
        campaignId: id,
        decision,
        scaledPercentage: scalePercentage
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
