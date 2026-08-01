import { NextResponse } from 'next/server';
import { BusinessOperatingSystem } from '../../../../services/business/BusinessOperatingSystem';

const bos = new BusinessOperatingSystem();

export async function GET() {
  const goals = bos.objectiveEngine.getObjectives();
  const gaps = goals.map((g) => bos.goalGapEngine.calculateGoalGap(g, 150));
  return NextResponse.json({ success: true, data: { goals, gaps } });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = bos.objectiveEngine.createObjective(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
