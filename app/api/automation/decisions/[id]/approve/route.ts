import { NextResponse } from 'next/server';
import { AutonomousOrchestrationEngine } from '../../../../../../services/automation/AutonomousOrchestrationEngine';
import { AutomationPersistenceService } from '../../../../../../services/automation/AutomationPersistenceService';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const decisionId = params.id;
    const orchestrator = new AutonomousOrchestrationEngine();
    const persistence = new AutomationPersistenceService();

    const approval = await persistence.createApprovalRequest(decisionId, undefined, 'Manual user approval');
    await persistence.resolveApprovalRequest(approval.id, 'APPROVED', 'User approved via dashboard');

    const result = await orchestrator.approveDecision(decisionId);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
