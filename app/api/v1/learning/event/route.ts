import { NextResponse } from 'next/server';
import { LearningEngine } from '../../../../../services/learning';

const learningEngine = new LearningEngine();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = learningEngine.ingestEvent(body);

    return NextResponse.json({
      success: true,
      event,
      message: 'Learning event ingested successfully.'
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to ingest learning event.'
    }, { status: 400 });
  }
}
