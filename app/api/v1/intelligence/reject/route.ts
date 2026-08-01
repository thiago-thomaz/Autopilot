import { NextResponse } from 'next/server';
import { AutonomousIntelligenceEngine } from '../../../../../services/intelligence/AutonomousIntelligenceEngine';

const aie = new AutonomousIntelligenceEngine();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rejected = aie.humanApprovalEngine.respondToApproval(body.approvalId || 'appr_sample', false, body.note || 'Rejected by operator');
    return NextResponse.json({ success: true, data: rejected });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
