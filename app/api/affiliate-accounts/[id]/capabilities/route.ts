import { NextRequest, NextResponse } from 'next/server';
import { AffiliateAccountService } from '@/services/affiliate/AffiliateAccountService';
import { AffiliatePlatformService } from '@/services/affiliate/AffiliatePlatformService';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const account = await AffiliateAccountService.getAccountById(params.id);
    const adapter = AffiliatePlatformService.getAdapter(account.affiliatePlatform.slug);
    const platformInfo = adapter.getPlatformInfo();

    return NextResponse.json({
      success: true,
      accountId: account.id,
      platformSlug: account.affiliatePlatform.slug,
      capabilities: platformInfo.capabilities,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode || 404 });
  }
}
