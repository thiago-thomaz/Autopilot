import { NextResponse } from 'next/server';
import { ModelRegistry } from '../../../../../services/predictive/ModelRegistry';

const registry = new ModelRegistry();

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    registry.rollbackToPreviousChampion('CONVERSION');
    return NextResponse.json({ success: true, message: `Model rolled back to previous Champion.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
