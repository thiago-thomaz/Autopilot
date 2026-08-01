import { NextResponse } from 'next/server';
import { AutonomousGrowthEngine } from '../../../../services/growth/AutonomousGrowthEngine';

const engine = new AutonomousGrowthEngine();

export async function GET() {
  const pending = engine.approvalEngine.getPending();
  return NextResponse.json({ success: true, data: pending });
}
