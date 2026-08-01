import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const accounts = await prisma.publicationAccount.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, count: accounts.length, accounts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const account = await prisma.publicationAccount.create({
      data: {
        platform: body.platform,
        accountName: body.accountName,
        accountIdentifier: body.accountIdentifier,
        country: body.country || 'BR',
        language: body.language || 'pt-BR',
        currency: body.currency || 'BRL',
        timezone: body.timezone || 'America/Sao_Paulo',
        status: body.status || 'ACTIVE',
      },
    });

    return NextResponse.json({ success: true, account }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
