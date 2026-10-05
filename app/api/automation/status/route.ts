import { NextResponse } from 'next/server';
import { InternalAutonomousEngine } from '../../../../services/automation/InternalAutonomousEngine';

export const dynamic = 'force-dynamic';

export async function GET() {
  const engine = InternalAutonomousEngine.getInstance();
  const status = engine.getStatus();

  return NextResponse.json({
    success: true,
    engine: 'InternalAutonomousEngine',
    mode: '100% Native - Zero External Dependencies (No n8n)',
    status,
    timestamp: new Date().toISOString(),
  });
}
