import { NextRequest, NextResponse } from 'next/server';
import { ProductDiscoveryService } from '@/services/discovery/ProductDiscoveryService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const product = await ProductDiscoveryService.importManualProduct(body);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, code: error.code }, { status: error.statusCode || 400 });
  }
}
