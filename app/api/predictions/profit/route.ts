import { NextResponse } from 'next/server';
import { ProfitPredictionModel, FeatureEngineeringEngine } from '../../../../services/predictive';

const profitModel = new ProfitPredictionModel();
const featureEngine = new FeatureEngineeringEngine();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const featureVector = featureEngine.extractFeatures(body);
    const expectedRevenue = Number(body.expectedRevenue ?? 100);
    const expectedCost = Number(body.expectedCost ?? 20);

    const result = profitModel.predictProfit(featureVector, expectedRevenue, expectedCost);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
