import { NextResponse } from 'next/server';
import { BusinessOperatingSystem } from '../../../../services/business/BusinessOperatingSystem';

const bos = new BusinessOperatingSystem();

export async function POST() {
  bos.setGlobalKillSwitch(false);
  return NextResponse.json({
    success: true,
    message: 'GLOBAL_BUSINESS_KILL_SWITCH DEACTIVATED. Business OS resumed operation.',
    status: { globalKillSwitch: false }
  });
}
