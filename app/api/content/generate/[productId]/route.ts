import { NextRequest, NextResponse } from 'next/server';
import { ContentEngine } from '@/services/content/ContentEngine';

export async function POST(req: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const body = await req.json().catch(() => ({}));
    const channel = body.channel || 'INSTAGRAM';
    const angle = body.angle || undefined;
    const generateVariations = body.generateVariations !== undefined ? body.generateVariations : true;

    if (generateVariations) {
      const results = await ContentEngine.generatePackageVariations(params.productId);
      return NextResponse.json({ success: true, count: results.length, results }, { status: 201 });
    }

    const singleResult = await ContentEngine.generateContentPackage(params.productId, angle, channel);
    return NextResponse.json({ success: true, result: singleResult }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: error.statusCode || 400 }
    );
  }
}
