import { NextResponse } from 'next/server';
import { BusinessOperatingSystem } from '../../../../services/business/BusinessOperatingSystem';

const bos = new BusinessOperatingSystem();

export async function GET() {
  const dre = bos.dreEngine.generateExecutiveDRE({
    commissionRevenue: 24500,
    refunds: 350,
    reversals: 150,
    aiCosts: 450,
    infrastructureCosts: 800,
    currency: 'USD'
  });
  return NextResponse.json({ success: true, data: dre });
}
