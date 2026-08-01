import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const ranking = [
      { rank: 1, country: 'US', countryName: 'United States', netMarketValueUSD: 14500.0, activeProducts: 42, roiPercent: 210.0, status: 'ACTIVE' },
      { rank: 2, country: 'DE', countryName: 'Germany', netMarketValueUSD: 8900.0, activeProducts: 24, roiPercent: 195.0, status: 'ACTIVE' },
      { rank: 3, country: 'UK', countryName: 'United Kingdom', netMarketValueUSD: 6400.0, activeProducts: 18, roiPercent: 175.0, status: 'TESTING' },
      { rank: 4, country: 'BR', countryName: 'Brazil', netMarketValueUSD: 5200.0, activeProducts: 35, roiPercent: 150.0, status: 'ACTIVE' }
    ];
    return NextResponse.json({ success: true, count: ranking.length, data: ranking });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
