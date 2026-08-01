import { NextResponse } from 'next/server';
import { BusinessOperatingSystem } from '../../../../services/business/BusinessOperatingSystem';

const bos = new BusinessOperatingSystem();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = bos.simulationEngine.runScenarioSimulation({
      baseNetRevenue: Number(body.baseNetRevenue) || 20000,
      baseCosts: Number(body.baseCosts) || 5000,
      commissionDeltaPercent: Number(body.commissionDeltaPercent) || 0,
      investmentAmount: Number(body.investmentAmount) || 0,
      investmentExpectedROI: Number(body.investmentExpectedROI) || 0
    });
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
