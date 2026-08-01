import { NextRequest, NextResponse } from 'next/server';
import { ProductPriceHistoryService } from '@/services/discovery/ProductPriceHistoryService';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const daysParam = searchParams.get('days');
    const days = daysParam ? parseInt(daysParam, 10) : undefined;

    const history = await ProductPriceHistoryService.getPriceHistory(params.id, days);
    return NextResponse.json({ success: true, count: history.length, history });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
