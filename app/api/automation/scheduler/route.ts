import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { InternalAutonomousEngine } from '../../../../services/automation/InternalAutonomousEngine';

export const dynamic = 'force-dynamic';

const actionSchema = z.object({
  action: z.enum(['START', 'STOP', 'STATUS']),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = actionSchema.parse(body);

    const engine = InternalAutonomousEngine.getInstance();

    if (action === 'START') {
      const started = engine.start();
      return NextResponse.json({ success: true, message: started ? 'Motor autônomo iniciado' : 'Motor já estava em execução', status: engine.getStatus() });
    }

    if (action === 'STOP') {
      const stopped = engine.stop();
      return NextResponse.json({ success: true, message: stopped ? 'Motor autônomo pausado' : 'Motor já estava pausado', status: engine.getStatus() });
    }

    return NextResponse.json({ success: true, status: engine.getStatus() });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
