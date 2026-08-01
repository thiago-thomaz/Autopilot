import { NextResponse } from 'next/server';
import { GlobalMarketEngine } from '../../../../services/global/GlobalMarketEngine';

const globalEngine = new GlobalMarketEngine();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pkg = globalEngine.localizePackage(
      body.contentPackageId || `pkg-${Date.now()}`,
      body.title || 'Product Offer',
      body.body || 'Amazing affiliate offer available now.',
      Number(body.price ?? 99.99),
      body.sourceCurrency || 'USD',
      body.sourceLanguage || 'en',
      body.targetCountry || 'DE',
      body.targetLanguage || 'de',
      body.targetCurrency || 'EUR'
    );

    const seo = globalEngine.getSEOConfig('product-deal', body.targetCountry || 'DE', body.targetLanguage || 'de', pkg.translatedTitle, pkg.translatedBody);

    return NextResponse.json({ success: true, data: { package: pkg, seo } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
