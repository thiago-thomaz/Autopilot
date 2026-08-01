import { NextResponse } from 'next/server';
import { AutomationPersistenceService } from '../../../../services/automation/AutomationPersistenceService';

export async function GET() {
  try {
    const persistence = new AutomationPersistenceService();
    const budget = await persistence.getBudget();
    const health = await persistence.getHealth();

    return NextResponse.json({
      success: true,
      data: {
        autonomyLevel: 'LEVEL_1_RECOMMEND',
        dailyBudget: budget.dailyBudget,
        monthlyBudget: budget.monthlyBudget,
        dailyLossLimit: budget.dailyLossLimit,
        globalKillSwitch: health.globalKillSwitch,
        circuitBreakerActive: health.circuitBreakerActive,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const persistence = new AutomationPersistenceService();

    if (body.dailyBudget !== undefined) {
      const budget = await persistence.getBudget();
      await persistence.updateSpend(0); // touch
    }

    await persistence.logAudit('USER', 'UPDATE_CONFIG', 'AutomationConfig', 'GLOBAL', body);

    return NextResponse.json({ success: true, message: 'Automation configuration updated' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
