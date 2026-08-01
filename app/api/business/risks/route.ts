import { NextResponse } from 'next/server';
import { BusinessOperatingSystem } from '../../../../services/business/BusinessOperatingSystem';

const bos = new BusinessOperatingSystem();

export async function GET() {
  const risks = [
    bos.riskEngine.evaluateRisk('FINANCIAL', 'Ad spend surge without corresponding CVR lift', 0.3, 0.7),
    bos.riskEngine.evaluateRisk('CONCENTRATION', 'Market concentration in US > 50%', 0.6, 0.8),
    bos.riskEngine.evaluateRisk('PLATFORM', 'Amazon affiliate policy updates', 0.4, 0.9)
  ];
  return NextResponse.json({ success: true, data: risks });
}
