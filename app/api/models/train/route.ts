import { NextResponse } from 'next/server';
import { ModelTrainingService } from '../../../../services/predictive/ModelTrainingService';

const trainingService = new ModelTrainingService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body.name || 'Challenger Model Candidate';
    const target = body.target || 'CONVERSION';

    const mockSplit = {
      trainFeatures: [],
      trainTargets: [],
      validationFeatures: [],
      validationTargets: [0.025, 0.028, 0.022, 0.030],
      testFeatures: [],
      testTargets: [],
      splitRatio: { train: 0.7, validation: 0.15, test: 0.15 },
      temporalBoundaries: { trainEnd: '2026-06-01', valEnd: '2026-07-01' }
    };

    const { model, metrics } = trainingService.trainAndEvaluateModel(name, target, mockSplit);
    return NextResponse.json({ success: true, data: { model, metrics } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
