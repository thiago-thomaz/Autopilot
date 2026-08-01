import { NextResponse } from 'next/server';
import { AutonomousGrowthEngine } from '../../../../services/growth/AutonomousGrowthEngine';

const engine = new AutonomousGrowthEngine();

export async function POST(request: Request) {
  try {
    engine.guardrails.setGlobalKillSwitch(false);
    return NextResponse.json({
      success: true,
      message: 'Global Kill Switch DEACTIVATED. System resumed operation.',
      status: {
        globalKillSwitch: false
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
