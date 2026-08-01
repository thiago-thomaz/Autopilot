import { NextRequest, NextResponse } from 'next/server';
import { OpportunityPersistenceService } from '@/services/opportunity/OpportunityPersistenceService';

export async function GET(req: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const history = await OpportunityPersistenceService.getSnapshotHistory(params.productId);
    return NextResponse.json({ success: true, count: history.length, history });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
