import { NextRequest, NextResponse } from 'next/server';
import { OpportunityRankingService } from '@/services/opportunity/OpportunityRankingService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const minScore = parseFloat(searchParams.get('minScore') || '40');

    const products = await OpportunityRankingService.getTopOpportunities(limit, minScore);
    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
