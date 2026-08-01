import { NextResponse } from 'next/server';
import { GlobalMarketEngine } from '../../../../services/global/GlobalMarketEngine';

const globalEngine = new GlobalMarketEngine();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = globalEngine.evaluateGlobalMarketOpportunity(
      body.productId || 'prod-001',
      body.category || 'ELECTRONICS',
      body.country || 'US',
      body.language || 'en',
      body.currency || 'USD',
      body.channel || 'INSTAGRAM',
      Number(body.expectedProfit ?? 50),
      Number(body.expectedROI ?? 150)
    );
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
