export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { AffiliatePlatformService } from '@/services/affiliate/AffiliatePlatformService';

export async function GET() {
  try {
    const platforms = await AffiliatePlatformService.listPlatforms();
    return NextResponse.json({ success: true, platforms });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
