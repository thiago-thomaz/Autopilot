import { NextResponse } from 'next/server';
import { PredictionService } from '../../../../services/predictive/PredictionService';

const predictionService = new PredictionService();

export async function GET() {
  try {
    // Generate sample predictive opportunities ranking
    const mockProducts = [
      { productId: 'prod-001', title: 'Ultra Quiet Wireless Earbuds Pro', category: 'ELECTRONICS', country: 'US', price: 79.99, commissionRate: 0.12, clicks: 450, cost: 25.0, sampleCount: 25 },
      { productId: 'prod-002', title: 'Organic Ergonomic Standing Desk', category: 'HOME_GARDEN', country: 'US', price: 299.00, commissionRate: 0.08, clicks: 310, cost: 40.0, sampleCount: 18 },
      { productId: 'prod-003', title: 'SaaS Automation Masterclass', category: 'SOFTWARE_SAAS', country: 'DE', price: 149.00, commissionRate: 0.40, clicks: 620, cost: 30.0, sampleCount: 42 },
      { productId: 'prod-004', title: 'Hydrating Botanical Serum', category: 'HEALTH_BEAUTY', country: 'BR', price: 45.00, commissionRate: 0.20, clicks: 800, cost: 15.0, sampleCount: 50 },
      { productId: 'prod-005', title: 'Smart Fitness Tracker Watch V2', category: 'ELECTRONICS', country: 'UK', price: 119.99, commissionRate: 0.15, clicks: 120, cost: 10.0, sampleCount: 2 } // Cold Start candidate
    ];

    const opportunityPromises = mockProducts.map(p => predictionService.predictEntityOpportunity(p));
    const fullResults = await Promise.all(opportunityPromises);
    const opportunities = fullResults.map(r => r.opportunity).sort((a, b) => b.opportunityScore - a.opportunityScore);

    return NextResponse.json({ success: true, count: opportunities.length, data: opportunities });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
