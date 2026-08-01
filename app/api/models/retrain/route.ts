import { NextResponse } from 'next/server';
import { ModelTrainingService } from '../../../../services/predictive/ModelTrainingService';

const trainingService = new ModelTrainingService();

export async function POST() {
  try {
    const mockSplit = {
      trainFeatures: [],
      trainTargets: [],
      validationFeatures: [],
      validationTargets: [0.024, 0.027, 0.021],
      testFeatures: [],
      testTargets: [],
      splitRatio: { train: 0.7, validation: 0.15, test: 0.15 },
      temporalBoundaries: { trainEnd: '2026-06-01', valEnd: '2026-07-01' }
    };

    const { model, metrics } = trainingService.trainAndEvaluateModel('Auto-Retrained Challenger', 'CONVERSION', mockSplit);
    return NextResponse.json({ success: true, message: 'Automated retraining completed.', data: { model, metrics } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
