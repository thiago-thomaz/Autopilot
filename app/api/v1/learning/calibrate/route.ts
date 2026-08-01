import { NextResponse } from 'next/server';
import { LearningEngine } from '../../../../../services/learning';

const learningEngine = new LearningEngine();

export async function POST(req: Request) {
  try {
    const summary = learningEngine.processLearningCycle();
    const calibrations = learningEngine.modelRegistry.getCalibrationHistory();

    return NextResponse.json({
      success: true,
      summary,
      calibrations,
      message: 'Learning cycle executed successfully.'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to execute learning cycle.'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const history = learningEngine.modelRegistry.getCalibrationHistory();
    return NextResponse.json({
      success: true,
      calibrations: history
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to retrieve calibration history.'
    }, { status: 500 });
  }
}
