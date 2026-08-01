import { NextRequest, NextResponse } from 'next/server';
import { OpportunityEngine } from '@/services/opportunity/OpportunityEngine';

export async function POST(req: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const result = await OpportunityEngine.analyzeProduct(params.productId);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: error.statusCode || 400 }
    );
  }
}
