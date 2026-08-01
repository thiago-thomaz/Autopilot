import { NextResponse } from 'next/server';
import { AutonomousGrowthEngine } from '../../../../services/growth/AutonomousGrowthEngine';

const engine = new AutonomousGrowthEngine();

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({ scope: 'GLOBAL' }));
    const scope = body.scope || 'GLOBAL';

    if (scope === 'GLOBAL') {
      engine.guardrails.setGlobalKillSwitch(true);
    } else if (body.channel) {
      engine.guardrails.setChannelKillSwitch(body.channel, true);
    } else if (body.country) {
      engine.guardrails.setCountryKillSwitch(body.country, true);
    }

    return NextResponse.json({
      success: true,
      message: `Emergency Kill Switch ACTIVATED for ${scope}`,
      status: {
        globalKillSwitch: engine.guardrails.globalKillSwitch
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
