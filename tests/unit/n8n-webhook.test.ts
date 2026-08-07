import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '../../app/api/n8n/events/route';
import { NextRequest } from 'next/server';

vi.mock('../../repositories/systemLog.repository', () => ({
  SystemLogRepository: {
    create: vi.fn().mockResolvedValue({ id: 'log_mock_123' }),
  },
}));

// Mock services to prevent actual execution during webhook tests
vi.mock('../../services/discovery/ProductDiscoveryService', () => ({
  ProductDiscoveryService: {
    discoverProducts: vi.fn().mockResolvedValue({ success: true, imported: 1 }),
  },
}));

vi.mock('../../services/content/CopywritingService', () => ({
  CopywritingService: {
    generatePostsForPendingDeals: vi.fn().mockResolvedValue({ generated: 1 }),
  },
}));

vi.mock('../../services/publication/PublishQueueService', () => ({
  PublishQueueService: {
    processPendingQueue: vi.fn().mockResolvedValue({ published: 1 }),
  },
}));

describe('POST /api/n8n/events (n8n Webhook API)', () => {
  beforeEach(() => {
    process.env.N8N_WEBHOOK_SECRET = 'test_secret_key_123';
    process.env.N8N_API_KEY = 'test_secret_key_123';
  });

  it('deve rejeitar requisição sem header x-n8n-api-key com status 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/n8n/events', {
      method: 'POST',
      body: JSON.stringify({
        event: 'DISCOVER_DEALS',
        source: 'n8n',
        timestamp: new Date().toISOString(),
        payload: {},
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.success).toBe(false);
  });

  it('deve rejeitar requisição com chave incorreta com status 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/n8n/events', {
      method: 'POST',
      headers: {
        'x-n8n-api-key': 'chave_errada',
      },
      body: JSON.stringify({
        event: 'DISCOVER_DEALS',
        source: 'n8n',
        timestamp: new Date().toISOString(),
        payload: {},
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.success).toBe(false);
  });

  it('deve rejeitar payload com timestamp inválido ou evento ausente com status 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/n8n/events', {
      method: 'POST',
      headers: {
        'x-n8n-api-key': 'test_secret_key_123',
      },
      body: JSON.stringify({
        event: '', // Evento vazio
        timestamp: 'invalid-date-format',
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
  });

  it('deve aceitar payload válido com chave correta e retornar status 200', async () => {
    const validTimestamp = new Date().toISOString();
    const req = new NextRequest('http://localhost:3000/api/n8n/events', {
      method: 'POST',
      headers: {
        'x-n8n-api-key': 'test_secret_key_123',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        event: 'DISCOVER_DEALS',
        source: 'n8n',
        timestamp: validTimestamp,
        payload: {
          externalId: '12345',
          title: 'Produto Teste',
          price: 99.9,
        },
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.event).toBe('DISCOVER_DEALS');
  });
});
