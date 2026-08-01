import { NextResponse } from 'next/server';
import { AutomationPersistenceService } from '../../../../../../services/automation/AutomationPersistenceService';
import { DecisionStatus, ApprovalStatus } from '../../../../../../types/automation/automation.types';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const decisionId = params.id;
    const body = await request.json().catch(() => ({}));
    const reason = body.reason || 'User rejected decision';

    const persistence = new AutomationPersistenceService();
    await persistence.updateDecisionStatus(decisionId, DecisionStatus.REJECTED);
    await persistence.logAudit('USER', 'REJECT_DECISION', 'Decision', decisionId, { reason });

    return NextResponse.json({ success: true, message: `Decision ${decisionId} rejected successfully` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
