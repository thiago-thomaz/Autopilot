import { NextResponse } from 'next/server';
import { ROIPredictionModel, FeatureEngineeringEngine } from '../../../../services/predictive';

const roiModel = new ROIPredictionModel();
const featureEngine = new FeatureEngineeringEngine();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const featureVector = featureEngine.extractFeatures(body);
    const expectedProfit = Number(body.expectedProfit ?? 80);
    const expectedCost = Number(body.expectedCost ?? 20);

    const result = roiModel.predictROI(featureVector, expectedProfit, expectedCost);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
