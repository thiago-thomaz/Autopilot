import { NextResponse } from 'next/server';
import { AutonomousIntelligenceEngine } from '../../../../../services/intelligence/AutonomousIntelligenceEngine';

const aie = new AutonomousIntelligenceEngine();

export async function GET() {
  const entries = aie.decisionJournal.getAllEntries();
  const pendingApprovals = aie.humanApprovalEngine.getPendingRequests();
  return NextResponse.json({ success: true, data: { journal: entries, pendingApprovals } });
}
