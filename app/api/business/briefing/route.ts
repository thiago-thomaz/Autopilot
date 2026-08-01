import { NextResponse } from 'next/server';
import { BusinessOperatingSystem } from '../../../../services/business/BusinessOperatingSystem';

const bos = new BusinessOperatingSystem();

export async function GET() {
  const briefing = bos.reportEngine.generateBriefing(28500, 26900, 1200, 9500, [
    'Concentration in US market is 55% (Monitored)'
  ]);
  return NextResponse.json({ success: true, data: briefing });
}
