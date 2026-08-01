import { NextResponse } from 'next/server';
import { PredictionService } from '../../../../services/predictive/PredictionService';

const predictionService = new PredictionService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items: any[] = Array.isArray(body.items) ? body.items : [body];

    const results = await Promise.all(
      items.map(item => predictionService.predictEntityOpportunity(item))
    );

    return NextResponse.json({ success: true, count: results.length, data: results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
