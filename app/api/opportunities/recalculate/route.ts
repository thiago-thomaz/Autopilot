import { NextRequest, NextResponse } from 'next/server';
import { OpportunityEngine } from '@/services/opportunity/OpportunityEngine';

export async function POST(req: NextRequest) {
  try {
    const { limit } = await req.json().catch(() => ({ limit: 100 }));
    const result = await OpportunityEngine.analyzeBatch(limit || 100);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
