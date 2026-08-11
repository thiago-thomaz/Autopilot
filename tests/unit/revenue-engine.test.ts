import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConversionService } from '../../services/revenue/ConversionService';
import { CommissionIntelligence } from '../../services/intelligence/CommissionIntelligence';
import { prisma } from '../../lib/prisma';

vi.mock('../../lib/prisma', () => {
  return {
    prisma: {
      conversion: {
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        count: vi.fn(),
      },
      commission: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        aggregate: vi.fn(),
        groupBy: vi.fn(),
      },
      clickEvent: {
        findUnique: vi.fn(),
        count: vi.fn(),
      },
      $queryRaw: vi.fn(),
    },
  };
});

describe('Revenue Engine & Commission Intelligence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ConversionService.ingestReport', () => {
    it('should create new conversion and commission if not exists', async () => {
      (prisma.clickEvent.findUnique as any).mockResolvedValue({ id: 'click-123' });
      (prisma.conversion.findFirst as any).mockResolvedValue(null);
      (prisma.conversion.create as any).mockResolvedValue({ id: 'conv-123' });
      (prisma.commission.findUnique as any).mockResolvedValue(null);

      const result = await ConversionService.ingestReport({
        clickId: 'click-123',
        externalOrderId: 'order-999',
        amount: 100,
        commission: 10,
        currency: 'BRL',
        status: 'CONFIRMED',
        marketplace: 'Amazon'
      });

      expect(result.success).toBe(true);
      expect(result.conversionId).toBe('conv-123');
      expect(prisma.conversion.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ status: 'CONFIRMED', clickEventId: 'click-123' })
      }));
      expect(prisma.commission.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ status: 'APPROVED', amount: 10 })
      }));
    });
  });

  describe('CommissionIntelligence.calculateEPC', () => {
    it('should calculate EPC correctly', async () => {
      (prisma.clickEvent.count as any).mockResolvedValue(100);
      (prisma.commission.aggregate as any).mockResolvedValue({
        _sum: { amount: 50 }
      });

      const epc = await CommissionIntelligence.calculateEPC();
      expect(epc).toBe(0.5); // 50 / 100
    });

    it('should return 0 if no clicks', async () => {
      (prisma.clickEvent.count as any).mockResolvedValue(0);
      const epc = await CommissionIntelligence.calculateEPC();
      expect(epc).toBe(0);
    });
  });

  describe('CommissionIntelligence.getProductRankingByEPC', () => {
    it('should return ranking', async () => {
      (prisma.$queryRaw as any).mockResolvedValue([
        { productId: 'prod-1', productTitle: 'Test 1', totalClicks: 100, totalRevenue: 50, epc: 0.5 },
        { productId: 'prod-2', productTitle: 'Test 2', totalClicks: 200, totalRevenue: 80, epc: 0.4 },
      ]);

      const ranking = await CommissionIntelligence.getProductRankingByEPC(2) as any[];
      expect(ranking).toHaveLength(2);
      expect(ranking[0].epc).toBe(0.5);
    });
  });
});

