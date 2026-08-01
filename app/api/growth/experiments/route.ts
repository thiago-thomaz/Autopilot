import { NextResponse } from 'next/server';
import { AutonomousGrowthEngine } from '../../../../services/growth/AutonomousGrowthEngine';

const engine = new AutonomousGrowthEngine();

export async function GET() {
  return NextResponse.json({
    success: true,
    data: [
      {
        id: 'exp_1',
        campaignId: 'cmp_1',
        experimentType: 'HOOK',
        hypothesis: 'Short punchy price drop hook increases CVR by 15%',
        status: 'RUNNING',
        minimumSample: 200,
        confidenceThreshold: 0.95
      }
    ]
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    engine.experimentController.validateExperiment(body);
    return NextResponse.json({ success: true, data: { ...body, id: `exp_${Date.now()}` } }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
