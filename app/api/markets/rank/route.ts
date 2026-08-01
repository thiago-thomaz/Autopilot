import { NextResponse } from 'next/server';
import { GlobalMarketEngine } from '../../../../services/global/GlobalMarketEngine';

const globalEngine = new GlobalMarketEngine();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const countries: string[] = Array.isArray(body.countries) ? body.countries : ['US', 'BR', 'DE', 'UK'];

    const scored = countries.map(c =>
      globalEngine.evaluateGlobalMarketOpportunity(
        body.productId || 'prod-001',
        body.category || 'ELECTRONICS',
        c,
        'en',
        'USD',
        'INSTAGRAM',
        Number(body.expectedProfit ?? 50),
        Number(body.expectedROI ?? 150)
      )
    ).sort((a, b) => b.opportunityScore - a.opportunityScore);

    return NextResponse.json({ success: true, count: scored.length, data: scored });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
