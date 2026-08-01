import { NextRequest, NextResponse } from 'next/server';
import { AffiliateConnectionService } from '@/services/affiliate/AffiliateConnectionService';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await AffiliateConnectionService.testAccountConnection(params.id);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, details: error.details }, { status: error.statusCode || 400 });
  }
}
