import { NextResponse } from 'next/server';
import { GlobalMarketEngine } from '../../../../services/global/GlobalMarketEngine';

const globalEngine = new GlobalMarketEngine();

export async function GET() {
  try {
    const mockCatalog = [
      { productId: 'prod-001', category: 'ELECTRONICS', country: 'US', language: 'en', currency: 'USD', channel: 'INSTAGRAM', expectedProfit: 45.0, expectedROI: 180.0 },
      { productId: 'prod-002', category: 'HOME_GARDEN', country: 'DE', language: 'de', currency: 'EUR', channel: 'BLOG', expectedProfit: 60.0, expectedROI: 210.0 },
      { productId: 'prod-003', category: 'SOFTWARE_SAAS', country: 'UK', language: 'en', currency: 'GBP', channel: 'YOUTUBE', expectedProfit: 85.0, expectedROI: 250.0 },
      { productId: 'prod-004', category: 'HEALTH_BEAUTY', country: 'BR', language: 'pt', currency: 'BRL', channel: 'WHATSAPP', expectedProfit: 30.0, expectedROI: 140.0 }
    ];

    const opportunities = mockCatalog.map(item =>
      globalEngine.evaluateGlobalMarketOpportunity(
        item.productId,
        item.category,
        item.country,
        item.language,
        item.currency,
        item.channel,
        item.expectedProfit,
        item.expectedROI
      )
    ).sort((a, b) => b.netMarketValue - a.netMarketValue);

    return NextResponse.json({ success: true, count: opportunities.length, data: opportunities });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
