import { NextResponse } from 'next/server';
import { BusinessOperatingSystem } from '../../../../services/business/BusinessOperatingSystem';

const bos = new BusinessOperatingSystem();

export async function POST() {
  bos.setGlobalKillSwitch(true);
  return NextResponse.json({
    success: true,
    message: 'GLOBAL_BUSINESS_KILL_SWITCH ACTIVATED. All Business OS automations halted immediately.',
    status: { globalKillSwitch: true }
  });
}
