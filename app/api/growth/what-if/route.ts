import { NextResponse } from 'next/server';
import { AutonomousGrowthEngine } from '../../../../services/growth/AutonomousGrowthEngine';

const engine = new AutonomousGrowthEngine();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const totalBudget = Number(body.totalBudget) || 5000;
    const allocations = body.allocations || [
      { category: 'HARVEST', amount: 2500, estimatedROI: 30 },
      { category: 'EXPANSION', amount: 1500, estimatedROI: 20 },
      { category: 'EXPLORATION', amount: 1000, estimatedROI: 10 }
    ];

    const result = engine.budgetSimulationEngine.runWhatIfAnalysis({
      totalBudget,
      allocations
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
