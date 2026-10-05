import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { InternalAutonomousEngine, AutonomousJobType } from '../../../../services/automation/InternalAutonomousEngine';
import { Logger } from '../../../../lib/logger';

export const dynamic = 'force-dynamic';

const runJobSchema = z.object({
  job: z.enum([
    'DISCOVER_DEALS',
    'GENERATE_POSTS',
    'PROCESS_PUBLISH_QUEUE',
    'SCHEDULED_REMINDERS',
    'IMPORT_CONVERSIONS',
    'RECALCULATE_RANKING',
    'RUN_DECISION_CYCLE',
    'CLEANUP_EXPIRED_DATA',
    'FULL_CYCLE',
  ]),
  payload: z.record(z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const authHeader =
      req.headers.get('x-automation-api-key') ||
      req.headers.get('x-internal-key') ||
      req.headers.get('authorization')?.replace('Bearer ', '') ||
      req.headers.get('x-n8n-api-key');

    const expectedKey =
      process.env.INTERNAL_AUTOMATION_KEY ||
      process.env.API_SECRET_KEY ||
      process.env.N8N_API_KEY ||
      'autopilot-internal-secret-2026';

    if (authHeader && authHeader !== expectedKey) {
      Logger.warn('AUTOMATION_API', 'UNAUTHORIZED_TRIGGER', 'Tentativa de disparo não autorizada em /api/automation/run');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = runJobSchema.parse(body);

    const engine = InternalAutonomousEngine.getInstance();
    const result = await engine.executeJob(parsed.job as AutonomousJobType, parsed.payload);

    return NextResponse.json({
      success: result.success,
      job: result.job,
      data: result.data,
      error: result.error,
      durationMs: result.durationMs,
      executedAt: result.executedAt,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid payload format', details: error.flatten() }, { status: 400 });
    }
    Logger.error('AUTOMATION_API', 'TRIGGER_FAILED', `Falha na rota /api/automation/run: ${error.message}`);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
