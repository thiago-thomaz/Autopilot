import { NextResponse } from 'next/server';
import { AutonomousGrowthEngine } from '../../../../../../services/growth/AutonomousGrowthEngine';

const engine = new AutonomousGrowthEngine();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json().catch(() => ({}));
    const action = body.action || 'APPROVE';

    if (action === 'REJECT') {
      const rejected = engine.approvalEngine.reject(id, body.reason || 'Rejected by operator');
      return NextResponse.json({ success: true, data: rejected });
    }

    const approved = engine.approvalEngine.approve(id);
    return NextResponse.json({ success: true, data: approved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
