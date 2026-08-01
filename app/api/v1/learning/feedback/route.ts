import { NextResponse } from 'next/server';
import { LearningEngine } from '../../../../../services/learning';

const learningEngine = new LearningEngine();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const feedback = learningEngine.feedbackEngine.collectFeedback(body);
    const aggregated = learningEngine.feedbackEngine.getAggregatedFeedback(body.entityId);

    return NextResponse.json({
      success: true,
      feedback,
      aggregated,
      message: 'Feedback recorded successfully.'
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to record feedback.'
    }, { status: 400 });
  }
}
