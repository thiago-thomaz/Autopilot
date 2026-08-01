import { NextResponse } from 'next/server';
import { ModelDriftDetector } from '../../../../services/predictive/ModelDriftDetector';

const driftDetector = new ModelDriftDetector();

export async function GET() {
  try {
    const report = driftDetector.detectModelDrift(
      { mae: 0.005, sampleCount: 1000, evaluationDate: '' },
      { mae: 0.0052, sampleCount: 500, evaluationDate: '' }
    );
    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
