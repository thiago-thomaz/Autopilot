import { NextResponse } from 'next/server';
import { AutonomousGrowthEngine } from '../../../../../../services/growth/AutonomousGrowthEngine';

const engine = new AutonomousGrowthEngine();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const transition = engine.orchestrator.transitionState(id, 'RUNNING', 'EXITED', 'Campaign graceful exit and deactivation');
    return NextResponse.json({ success: true, data: transition });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
