import { NextResponse } from 'next/server';
import { BusinessOperatingSystem } from '../../../../services/business/BusinessOperatingSystem';

const bos = new BusinessOperatingSystem();

export async function GET() {
  const cycle = bos.runExecutiveCycle({
    commissionRevenue: 28500,
    refunds: 300,
    reversals: 100,
    aiCosts: 450,
    infrastructureCosts: 750,
    cashBalance: 9500
  });

  return NextResponse.json({ success: true, data: cycle });
}
