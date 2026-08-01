import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    return NextResponse.json({
      success: true,
      data: {
        modelId: id,
        metrics: {
          mae: 0.0048,
          rmse: 0.0075,
          r2Score: 0.812,
          accuracy: 0.89,
          sampleCount: 2450,
          evaluationDate: new Date().toISOString()
        },
        driftStatus: {
          hasDrift: false,
          driftMagnitude: 2.1,
          status: 'HEALTHY'
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
