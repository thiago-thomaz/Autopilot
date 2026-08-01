import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pkg = await prisma.contentPackage.findUnique({
      where: { id: params.id },
      include: {
        product: { include: { affiliatePlatform: true } },
        versions: { orderBy: { version: 'desc' } },
      },
    });

    if (!pkg) {
      return NextResponse.json({ success: false, error: 'Pacote de conteúdo não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, package: pkg });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
