import { NextResponse } from 'next/server';
import { ExpansionEngine } from '../../../../../services/global/ExpansionEngine';

const expansionEngine = new ExpansionEngine();

export async function POST(request: Request, { params }: { params: { country: string } }) {
  try {
    const { country } = params;
    const state = expansionEngine.evaluateStageTransition(country, 'EXPAND', 250.0, 0);
    return NextResponse.json({ success: true, message: `Expansion triggered for ${country}`, data: state });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
