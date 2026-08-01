import { NextRequest, NextResponse } from 'next/server';
import { n8nEventSchema } from '../../../../schemas/n8n';
import { Logger } from '../../../../lib/logger';
import { SystemLogRepository } from '../../../../repositories/systemLog.repository';

export async function POST(req: NextRequest) {
  const timestamp = new Date().toISOString();

  // 1. Validar chave de API do header x-n8n-api-key
  const apiKeyHeader = req.headers.get('x-n8n-api-key');
  const configuredApiKey = process.env.N8N_API_KEY || 'n8n_secret_autopilot_key_2026';

  if (!apiKeyHeader || apiKeyHeader !== configuredApiKey) {
    Logger.warn('N8N_WEBHOOK', 'UNAUTHORIZED_ACCESS', 'Tentativa de acesso com chave n8n inválida ou ausente.', {
      ip: req.ip || 'desconhecido',
    });
    return NextResponse.json(
      {
        success: false,
        error: 'Não autorizado: Chave de API n8n (x-n8n-api-key) inválida ou ausente.',
      },
      { status: 401 }
    );
  }

  // 2. Tentar ler e validar o body JSON com Zod
  try {
    const rawBody = await req.json();
    const parseResult = n8nEventSchema.safeParse(rawBody);

    if (!parseResult.success) {
      Logger.warn('N8N_WEBHOOK', 'VALIDATION_ERROR', 'Payload de evento n8n inválido.', {
        errors: parseResult.error.flatten(),
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Payload inválido',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { event, source, payload, timestamp: eventTimestamp } = parseResult.data;

    // 3. Registrar o evento em log
    const logMessage = `Evento n8n '${event}' recebido com sucesso de '${source}'.`;
    Logger.info('N8N_WEBHOOK', event, logMessage, { payload, eventTimestamp });

    await SystemLogRepository.create({
      level: 'INFO',
      module: 'n8n-integration',
      event: event,
      message: logMessage,
      metadata: { payload, source, eventTimestamp },
    });

    // 4. Retornar resposta de sucesso
    return NextResponse.json(
      {
        success: true,
        eventId: `evt_${Date.now()}`,
        message: 'Evento n8n recebido e registrado com sucesso',
        processedAt: timestamp,
      },
      { status: 200 }
    );
  } catch (error: any) {
    Logger.error('N8N_WEBHOOK', 'INTERNAL_ERROR', 'Erro interno ao processar evento n8n.', {
      error: error?.message,
    });
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno ao processar evento n8n',
      },
      { status: 500 }
    );
  }
}
