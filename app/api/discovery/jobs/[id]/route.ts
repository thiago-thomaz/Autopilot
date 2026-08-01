import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const job = await prisma.discoveryJob.findUnique({
      where: { id: params.id },
    });
    if (!job) return NextResponse.json({ success: false, error: 'Trabalho de descoberta não encontrado.' }, { status: 404 });
    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
