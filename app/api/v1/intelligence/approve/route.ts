import { NextResponse } from 'next/server';
import { AutonomousIntelligenceEngine } from '../../../../../services/intelligence/AutonomousIntelligenceEngine';

const aie = new AutonomousIntelligenceEngine();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const approved = aie.humanApprovalEngine.respondToApproval(body.approvalId || 'appr_sample', true, body.note);
    return NextResponse.json({ success: true, data: approved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
