import { NextResponse } from 'next/server';
import { LearningEngine } from '../../../../../services/learning';

const learningEngine = new LearningEngine();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const knowledgeType = searchParams.get('type') as any;
    const country = searchParams.get('country') || undefined;
    const minConfidenceStr = searchParams.get('minConfidence');

    const minConfidence = minConfidenceStr ? parseFloat(minConfidenceStr) : undefined;

    const results = learningEngine.knowledgeEngine.queryKnowledge({
      knowledgeType,
      country,
      minConfidence
    });

    return NextResponse.json({
      success: true,
      count: results.length,
      knowledge: results
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to query knowledge.'
    }, { status: 500 });
  }
}
