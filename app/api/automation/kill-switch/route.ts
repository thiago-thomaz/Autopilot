import { NextResponse } from 'next/server';
import { AutomationPersistenceService } from '../../../../services/automation/AutomationPersistenceService';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const scope = body.scope || 'GLOBAL';

    const persistence = new AutomationPersistenceService();
    await persistence.updateHealth(0, true, true);
    await persistence.logAudit('USER', 'ACTIVATE_KILL_SWITCH', 'System', scope, { reason: body.reason || 'Manual kill switch trigger' });

    return NextResponse.json({ success: true, message: `Kill switch activated for scope: ${scope}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
