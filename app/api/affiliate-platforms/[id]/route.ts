import { NextRequest, NextResponse } from 'next/server';
import { AffiliatePlatformService } from '@/services/affiliate/AffiliatePlatformService';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const platform = await AffiliatePlatformService.getPlatformByIdOrSlug(params.id);
    return NextResponse.json({ success: true, platform });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode || 500 });
  }
}
