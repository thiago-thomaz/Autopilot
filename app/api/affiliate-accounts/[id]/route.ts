import { NextRequest, NextResponse } from 'next/server';
import { AffiliateAccountService } from '@/services/affiliate/AffiliateAccountService';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const account = await AffiliateAccountService.getAccountById(params.id);
    return NextResponse.json({ success: true, account });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode || 404 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const account = await AffiliateAccountService.updateAccount(params.id, body);
    return NextResponse.json({ success: true, account });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode || 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await AffiliateAccountService.deleteAccount(params.id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode || 404 });
  }
}
