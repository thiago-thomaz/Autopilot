import { NextResponse } from 'next/server';
import { PredictionService } from '../../../services/predictive/PredictionService';

const predictionService = new PredictionService();

export async function GET() {
  try {
    const mockProducts = [
      { productId: 'prod-001', title: 'Ultra Quiet Wireless Earbuds Pro', category: 'ELECTRONICS', country: 'US', price: 79.99, commissionRate: 0.12, clicks: 450, cost: 25.0 },
      { productId: 'prod-003', title: 'SaaS Automation Masterclass', category: 'SOFTWARE_SAAS', country: 'DE', price: 149.00, commissionRate: 0.40, clicks: 620, cost: 30.0 }
    ];

    const fullResults = await Promise.all(mockProducts.map(p => predictionService.predictEntityOpportunity(p)));
    const opportunities = fullResults.map(r => r.opportunity);
    const recommendations = predictionService.generateRecommendations(opportunities);

    return NextResponse.json({ success: true, count: recommendations.length, data: recommendations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
