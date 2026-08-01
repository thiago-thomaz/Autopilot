import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const search = await prisma.discoverySearch.findUnique({
      where: { id: params.id },
    });
    if (!search) return NextResponse.json({ success: false, error: 'Busca não encontrada.' }, { status: 404 });
    return NextResponse.json({ success: true, search });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
