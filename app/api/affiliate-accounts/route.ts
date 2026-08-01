import { NextRequest, NextResponse } from 'next/server';
import { AffiliateAccountService } from '@/services/affiliate/AffiliateAccountService';

export async function GET() {
  try {
    const accounts = await AffiliateAccountService.listAccounts();
    return NextResponse.json({ success: true, accounts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const account = await AffiliateAccountService.createAccount(body);
    return NextResponse.json({ success: true, account }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode || 400 });
  }
}
