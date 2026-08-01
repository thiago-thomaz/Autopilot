import { NextRequest, NextResponse } from 'next/server';
import { DiscoveryJobService } from '@/services/discovery/DiscoveryJobService';
import { ProductDiscoveryService } from '@/services/discovery/ProductDiscoveryService';

export async function GET() {
  try {
    const jobs = await DiscoveryJobService.listJobs(50);
    return NextResponse.json({ success: true, jobs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await ProductDiscoveryService.discoverProducts(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, code: error.code }, { status: error.statusCode || 400 });
  }
}
