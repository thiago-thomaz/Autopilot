import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ProductDiscoveryService } from '../../../../services/discovery/ProductDiscoveryService';
import { CopywritingService } from '../../../../services/content/CopywritingService';
import { PublishQueueService } from '../../../../services/publication/PublishQueueService';
import { Logger } from '../../../../lib/logger';
import { SystemLogRepository } from '../../../../repositories/systemLog.repository';

const eventSchema = z.object({
  event: z.enum(['DISCOVER_DEALS', 'GENERATE_POSTS', 'PROCESS_PUBLISH_QUEUE']),
  source: z.string().optional(),
  timestamp: z.string().optional(),
  deals: z.array(z.any()).optional(),
  payload: z.record(z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  const timestamp = new Date().toISOString();
  try {
    // 1. Suporte duplo de cabeçalho para evitar 401 Unauthorized
    const authHeader = req.headers.get('x-n8n-api-key') || req.headers.get('x-n8n-secret');
    const validSecret = process.env.N8N_API_KEY || process.env.N8N_WEBHOOK_SECRET || 'autopilot-n8n-secret';

    if (!authHeader || authHeader !== validSecret) {
      Logger.warn('N8N_EVENT_HANDLER', 'UNAUTHORIZED_ATTEMPT', 'Tentativa de webhook não autorizada.');
      return NextResponse.json({ success: false, error: 'Unauthorized (missing or invalid x-n8n-api-key)' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = eventSchema.parse(body);

    const logMessage = `Evento n8n '${parsed.event}' recebido com sucesso de '${parsed.source || 'N8N'}'.`;
    Logger.info('N8N_EVENT_HANDLER', 'EVENT_RECEIVED', logMessage, { payload: parsed.payload, timestamp });

    await SystemLogRepository.create({
      level: 'INFO',
      module: 'n8n-integration',
      event: parsed.event,
      message: logMessage,
      metadata: { payload: parsed.payload, source: parsed.source, timestamp },
    });

    let resultData: any = null;

    // 2. DISPARO REAL DOS SERVIÇOS DO PILOTO AUTOMÁTICO
    switch (parsed.event) {
      case 'DISCOVER_DEALS':
        // Executa a busca real de ofertas no catálogo/API. Usamos payload se fornecido, senão usamos padrão de busca da Amazon.
        const discoveryPayload = parsed.payload && Object.keys(parsed.payload).length > 0
          ? parsed.payload
          : { platform: 'amazon-brasil', query: 'oferta', limit: 10 };
        resultData = await ProductDiscoveryService.discoverProducts(discoveryPayload);
        break;

      case 'GENERATE_POSTS':
        // Gera as cópias persuasivas e insere na fila de publicação
        resultData = await CopywritingService.generatePostsForPendingDeals(parsed.deals || []);
        break;

      case 'PROCESS_PUBLISH_QUEUE':
        // Transmite as mensagens pendentes para os canais (Telegram/WhatsApp)
        resultData = await PublishQueueService.processPendingQueue();
        break;
    }

    return NextResponse.json({
      success: true,
      event: parsed.event,
      data: resultData,
      processedAt: timestamp,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }
    Logger.error('N8N_EVENT_HANDLER', 'PROCESSING_FAILED', 'Falha ao processar evento do n8n', { error: error.message });
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

