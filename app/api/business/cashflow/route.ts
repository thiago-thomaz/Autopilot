import { NextResponse } from 'next/server';
import { BusinessOperatingSystem } from '../../../../services/business/BusinessOperatingSystem';

const bos = new BusinessOperatingSystem();

export async function GET() {
  const statement = bos.cashFlowEngine.generateStatement(8000, 24000, 5000, 2000, 'USD');
  const reserves = bos.cashReserveManager.getConfig();
  return NextResponse.json({ success: true, data: { statement, reserves } });
}
