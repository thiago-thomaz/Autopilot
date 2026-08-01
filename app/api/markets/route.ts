import { NextResponse } from 'next/server';
import { GlobalMarketEngine } from '../../../services/global/GlobalMarketEngine';

const globalEngine = new GlobalMarketEngine();

export async function GET() {
  try {
    const markets = globalEngine.getSupportedMarkets();
    return NextResponse.json({ success: true, count: markets.length, data: markets });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
