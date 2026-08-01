import { NextResponse } from 'next/server';
import { AutonomousGrowthEngine } from '../../../../services/growth/AutonomousGrowthEngine';

const engine = new AutonomousGrowthEngine();

export async function GET() {
  try {
    const campaigns = await engine.persistence.getActiveCampaigns();
    return NextResponse.json({ success: true, data: campaigns });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const campaign = await engine.persistence.createCampaign(body);
    return NextResponse.json({ success: true, data: campaign }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
