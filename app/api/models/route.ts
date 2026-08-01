import { NextResponse } from 'next/server';
import { ModelRegistry } from '../../../services/predictive/ModelRegistry';

const registry = new ModelRegistry();

export async function GET() {
  try {
    const models = registry.listModels();
    return NextResponse.json({ success: true, data: models });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
