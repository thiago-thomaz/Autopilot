import { NextRequest, NextResponse } from 'next/server';
import { ContentEngine } from '@/services/content/ContentEngine';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updatedPkg = await ContentEngine.regeneratePackage(params.id);
    return NextResponse.json({ success: true, package: updatedPkg });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode || 400 });
  }
}
