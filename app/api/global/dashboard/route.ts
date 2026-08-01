import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        globalRevenueUSD: 48500.0,
        globalNetProfitUSD: 18240.0,
        globalROIPercent: 215.0,
        activeMarketsCount: 4,
        testingMarketsCount: 2,
        totalLocalizedPackages: 142,
        topMarket: 'US'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
