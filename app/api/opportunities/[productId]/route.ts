import { NextRequest, NextResponse } from 'next/server';
import { OpportunityPersistenceService } from '@/services/opportunity/OpportunityPersistenceService';

export async function GET(req: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const snapshot = await OpportunityPersistenceService.getLatestSnapshot(params.productId);
    if (!snapshot) {
      return NextResponse.json({ success: false, error: 'Snapshot de oportunidade não encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, snapshot });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
