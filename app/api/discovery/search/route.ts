import { NextRequest, NextResponse } from 'next/server';
import { ProductDiscoveryService } from '@/services/discovery/ProductDiscoveryService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await ProductDiscoveryService.discoverProducts(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro na descoberta de produtos.',
        code: error.code || 'DISCOVERY_ERROR',
        details: error.details,
      },
      { status: error.statusCode || 400 }
    );
  }
}
