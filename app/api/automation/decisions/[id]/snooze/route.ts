import { NextResponse } from 'next/server';
import { AutomationPersistenceService } from '../../../../../../services/automation/AutomationPersistenceService';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const decisionId = params.id;
    const persistence = new AutomationPersistenceService();

    await persistence.logAudit('USER', 'SNOOZE_DECISION', 'Decision', decisionId, { snoozedUntil: new Date(Date.now() + 86400000) });

    return NextResponse.json({ success: true, message: `Decision ${decisionId} snoozed for 24 hours` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
