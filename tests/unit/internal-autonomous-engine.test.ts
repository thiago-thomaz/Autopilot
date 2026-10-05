import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InternalAutonomousEngine } from '../../services/automation/InternalAutonomousEngine';

vi.mock('../../repositories/systemLog.repository', () => ({
  SystemLogRepository: {
    create: vi.fn().mockResolvedValue({ id: 'log_mock_123' }),
  },
}));

vi.mock('../../services/discovery/ProductDiscoveryService', () => ({
  ProductDiscoveryService: {
    discoverProducts: vi.fn().mockResolvedValue({ success: true, products: [{ id: 'p1', title: 'Test Product' }] }),
  },
}));

vi.mock('../../services/content/CopywritingService', () => ({
  CopywritingService: {
    generatePostsForPendingDeals: vi.fn().mockResolvedValue({ generated: 1 }),
  },
}));

vi.mock('../../services/publication/PublishQueueService', () => ({
  PublishQueueService: {
    processPendingQueue: vi.fn().mockResolvedValue({ processed: 2, successful: 2, failed: 0 }),
  },
}));

vi.mock('../../lib/prisma', () => ({
  prisma: {
    publicationQueueItem: {
      count: vi.fn().mockResolvedValue(1),
    },
    systemLog: {
      deleteMany: vi.fn().mockResolvedValue({ count: 5 }),
    },
    product: {
      deleteMany: vi.fn().mockResolvedValue({ count: 2 }),
    },
  },
}));

describe('InternalAutonomousEngine (100% Native - No n8n)', () => {
  let engine: InternalAutonomousEngine;

  beforeEach(() => {
    vi.useFakeTimers();
    process.env.ENABLE_AUTOMATION = 'true';
    engine = InternalAutonomousEngine.getInstance();
    engine.stop();
  });

  afterEach(() => {
    engine.stop();
    vi.useRealTimers();
  });

  it('deve ser um singleton consistente', () => {
    const instanceA = InternalAutonomousEngine.getInstance();
    const instanceB = InternalAutonomousEngine.getInstance();
    expect(instanceA).toBe(instanceB);
  });

  it('deve iniciar e parar os timers nativos com precisão', () => {
    const started = engine.start();
    expect(started).toBe(true);

    const statusRunning = engine.getStatus();
    expect(statusRunning.isRunning).toBe(true);
    expect(statusRunning.startedAt).not.toBeNull();

    // Não deve reiniciar se já estiver rodando
    const startedAgain = engine.start();
    expect(startedAgain).toBe(false);

    // Parar
    const stopped = engine.stop();
    expect(stopped).toBe(true);

    const statusStopped = engine.getStatus();
    expect(statusStopped.isRunning).toBe(false);
  });

  it('deve executar job de limpeza CLEANUP_EXPIRED_DATA com sucesso', async () => {
    const result = await engine.executeJob('CLEANUP_EXPIRED_DATA');
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ logsDeleted: 5, productsDeleted: 2 });

    const status = engine.getStatus();
    expect(status.jobStats.CLEANUP_EXPIRED_DATA.successes).toBeGreaterThanOrEqual(1);
  });

  it('deve executar régua de agendamentos e lembretes SCHEDULED_REMINDERS', async () => {
    const result = await engine.executeJob('SCHEDULED_REMINDERS');
    expect(result.success).toBe(true);
    expect(result.data.readyPublished).toBe(1);
    expect(result.data.cadenceChecked).toBeDefined();
  });

  it('deve executar fluxo completo de descoberta e geração no DISCOVER_DEALS', async () => {
    const result = await engine.executeJob('DISCOVER_DEALS');
    expect(result.success).toBe(true);
    expect(result.data.discovery.success).toBe(true);
    expect(result.data.generation.generated).toBe(1);
    expect(result.data.publication.processed).toBe(2);
  });

  it('deve computar estatísticas e status sem falhas', () => {
    const status = engine.getStatus();
    expect(status.intervals.publishingDispatcherMs).toBeDefined();
    expect(status.intervals.discoveryCycleMs).toBeDefined();
    expect(status.intervals.remindersCadenceMs).toBeDefined();
    expect(status.jobStats).toBeDefined();
  });
});
