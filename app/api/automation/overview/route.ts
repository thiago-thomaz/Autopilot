import { NextResponse } from 'next/server';
import { AutomationPersistenceService } from '../../../../services/automation/AutomationPersistenceService';

export async function GET() {
  try {
    const persistence = new AutomationPersistenceService();
    const health = await persistence.getHealth();
    const budget = await persistence.getBudget();

    return NextResponse.json({
      success: true,
      data: {
        health,
        budget,
        autonomyLevel: 'LEVEL_1_RECOMMEND',
        simulationMode: false,
        shadowMode: false,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
