import { NextRequest, NextResponse } from 'next/server';
import { AttributionEngine } from '@/services/analytics/AttributionEngine';

export async function GET(req: NextRequest) {
  try {
    const sampleTouchpoints = [
      { id: 'tp_1', timestamp: new Date(Date.now() - 3 * 86400000), channel: 'INSTAGRAM' },
      { id: 'tp_2', timestamp: new Date(Date.now() - 2 * 86400000), channel: 'TELEGRAM' },
      { id: 'tp_3', timestamp: new Date(Date.now() - 1 * 86400000), channel: 'OWN_WEBSITE' },
    ];

    const lastClick = AttributionEngine.attributeConversion('conv_123', 100, 80, sampleTouchpoints, 'LAST_CLICK');
    const firstClick = AttributionEngine.attributeConversion('conv_123', 100, 80, sampleTouchpoints, 'FIRST_CLICK');
    const linear = AttributionEngine.attributeConversion('conv_123', 100, 80, sampleTouchpoints, 'LINEAR');
    const positionBased = AttributionEngine.attributeConversion('conv_123', 100, 80, sampleTouchpoints, 'POSITION_BASED');
    const timeDecay = AttributionEngine.attributeConversion('conv_123', 100, 80, sampleTouchpoints, 'TIME_DECAY');

    return NextResponse.json({
      success: true,
      comparison: {
        lastClick,
        firstClick,
        linear,
        positionBased,
        timeDecay,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
