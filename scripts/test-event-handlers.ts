import { POST } from '../app/api/n8n/events/route';
import { NextRequest } from 'next/server';

process.env.N8N_WEBHOOK_SECRET = 'autopilot-n8n-secret';
process.env.N8N_API_KEY = 'autopilot-n8n-secret'; // force pass
process.env.MOCK_MODE = 'true';
process.env.NODE_ENV = 'test';

async function mockRequest(body: any): Promise<any> {
  const req = {
    json: async () => body,
    headers: {
      get: (key: string) => key === 'x-n8n-secret' ? 'autopilot-n8n-secret' : null
    }
  } as unknown as NextRequest;
  
  const res = await POST(req);
  return res.json();
}

async function runSmokeTests() {
  console.log('Iniciando Smoke Tests dos Eventos do n8n...');
  let hasFailed = false;

  const events = [
    { event: 'DISCOVER_DEALS', payload: { source: 'smoke_test', limit: 1 } },
    { event: 'PROCESS_PUBLISH_QUEUE', payload: {} },
    { event: 'IMPORT_CONVERSIONS', payload: { platform: 'AMAZON', data: [{ clickId: 'test-click', commission: 1 }] } },
    { event: 'CLEANUP_EXPIRED_DATA', payload: {} }
  ];

  for (const ev of events) {
    try {
      console.log(`\nTestando evento: ${ev.event}`);
      const res = await mockRequest(ev);
      if (res.success) {
        console.log(`✅ [SUCESSO] Evento ${ev.event} processado.`);
        console.log(`   Retorno:`, JSON.stringify(res.data).substring(0, 100) + '...');
      } else {
        console.error(`❌ [FALHA] Evento ${ev.event} retornou erro:`, res.error);
        hasFailed = true;
      }
    } catch (e: any) {
      console.error(`❌ [ERRO CRÍTICO] Falha ao testar ${ev.event}:`, e.message);
      hasFailed = true;
    }
  }

  if (hasFailed) {
    console.error('\n⚠️ Smoke tests falharam em um ou mais eventos.');
    process.exit(1);
  } else {
    console.log('\n🚀 [TUDO PRONTO] Todos os eventos testados com 0 falhas.');
    process.exit(0);
  }
}

runSmokeTests();
