import { NextResponse } from 'next/server';
import { PredictionService } from '../../../../services/predictive/PredictionService';

const predictionService = new PredictionService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await predictionService.predictEntityOpportunity({
      ...body,
      entityType: 'PRODUCT'
    });
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
