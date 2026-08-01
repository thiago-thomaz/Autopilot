import { NextResponse } from 'next/server';
import { AutomationPersistenceService } from '../../../../services/automation/AutomationPersistenceService';

export async function POST() {
  try {
    const persistence = new AutomationPersistenceService();
    await persistence.updateHealth(100, false, false);
    await persistence.logAudit('USER', 'RESUME_AUTOMATION', 'System', 'GLOBAL', { reason: 'Automation resumed by user' });

    return NextResponse.json({ success: true, message: 'Automation resumed successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
