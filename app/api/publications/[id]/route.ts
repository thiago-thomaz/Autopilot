import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pub = await prisma.publicationRecord.findUnique({
      where: { id: params.id },
      include: {
        contentPackage: { include: { product: true } },
        auditLogs: { orderBy: { createdAt: 'desc' } },
        queueItems: true,
      },
    });

    if (!pub) {
      return NextResponse.json({ success: false, error: 'Registro de publicação não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, publication: pub });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
