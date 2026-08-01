import { NextRequest, NextResponse } from 'next/server';
import { DiscoveryQueryService } from '@/services/discovery/DiscoveryQueryService';
import { ProductDiscoveryService } from '@/services/discovery/ProductDiscoveryService';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const savedQuery = await DiscoveryQueryService.getQueryById(params.id);
    const result = await ProductDiscoveryService.discoverProducts({
      platform: savedQuery.platform,
      query: savedQuery.query,
      category: savedQuery.category || undefined,
      brand: savedQuery.brand || undefined,
      minPrice: savedQuery.minPrice || undefined,
      maxPrice: savedQuery.maxPrice || undefined,
      minRating: savedQuery.minRating || undefined,
      sortBy: savedQuery.sortBy || 'RELEVANCE',
      limit: 10,
    });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, code: error.code }, { status: error.statusCode || 400 });
  }
}
