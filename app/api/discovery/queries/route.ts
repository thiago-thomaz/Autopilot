import { NextRequest, NextResponse } from 'next/server';
import { DiscoveryQueryService } from '@/services/discovery/DiscoveryQueryService';

export async function GET() {
  try {
    const queries = await DiscoveryQueryService.listQueries();
    return NextResponse.json({ success: true, queries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = await DiscoveryQueryService.createQuery(body);
    return NextResponse.json({ success: true, query }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
