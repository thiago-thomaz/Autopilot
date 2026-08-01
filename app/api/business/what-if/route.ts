import { NextResponse } from 'next/server';
import { BusinessOperatingSystem } from '../../../../services/business/BusinessOperatingSystem';

const bos = new BusinessOperatingSystem();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = bos.simulationEngine.runScenarioSimulation({
      baseNetRevenue: Number(body.baseNetRevenue) || 30000,
      baseCosts: Number(body.baseCosts) || 8000,
      commissionDeltaPercent: Number(body.commissionDeltaPercent) || -20,
      investmentAmount: Number(body.investmentAmount) || 5000,
      investmentExpectedROI: Number(body.investmentExpectedROI) || 25
    });
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
