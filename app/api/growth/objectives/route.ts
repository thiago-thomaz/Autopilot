import { NextResponse } from 'next/server';
import { AutonomousGrowthEngine } from '../../../../services/growth/AutonomousGrowthEngine';

const engine = new AutonomousGrowthEngine();

export async function GET() {
  try {
    const objectives = await engine.persistence.getGrowthObjectives();
    return NextResponse.json({ success: true, data: objectives });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const objective = await engine.persistence.createGrowthObjective(body);
    return NextResponse.json({ success: true, data: objective }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
