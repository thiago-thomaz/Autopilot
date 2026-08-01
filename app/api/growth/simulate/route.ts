import { NextResponse } from 'next/server';
import { AutonomousGrowthEngine } from '../../../../services/growth/AutonomousGrowthEngine';

const engine = new AutonomousGrowthEngine();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const baseBudget = Number(body.baseBudget) || 1000;
    const expectedROI = Number(body.expectedROI) || 25;
    const scenario = body.scenario || 'BASE';

    const result = engine.growthSimulationEngine.simulateTrajectory(
      { baseBudget, expectedROI, volatility: 0.15 },
      scenario
    );

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
