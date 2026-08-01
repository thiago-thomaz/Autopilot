import { describe, it, expect, vi } from 'vitest';
import { PublicationPlanner } from '../../services/publication/PublicationPlanner';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    contentPackage: {
      findUnique: vi.fn().mockResolvedValue({
        id: 'pkg_test_999',
        productId: 'prod_999',
        title: 'Kindle Paperwhite 16GB',
        hook: 'Aproveite o Kindle Paperwhite em promoção!',
        caption: 'Legenda de teste completa.',
        cta: 'Confira no link!',
        affiliateDisclosure: '#afiliado',
        status: 'READY_FOR_PUBLICATION',
        product: {
          id: 'prod_999',
          url: 'https://www.amazon.com.br/dp/B08N5WRWNW',
          currentPrice: 749.0,
          currency: 'BRL',
        },
      }),
    },
    $transaction: vi.fn().mockImplementation(async (callback) => callback({
      publicationRecord: { create: vi.fn().mockImplementation((data) => Promise.resolve({ id: `pub_${Math.random()}`, ...data.data })) },
      publicationQueueItem: { create: vi.fn().mockResolvedValue({ id: 'item_999' }) },
      publicationAuditLog: { create: vi.fn().mockResolvedValue({ id: 'log_999' }) },
    })),
  },
}));

describe('PublicationPlanner (Versão Internacional)', () => {
  it('deve gerar plano de distribuição para múltiplos canais e países com UTMs e moedas convertidas', async () => {
    const res = await PublicationPlanner.createPlan({
      contentPackageId: 'pkg_test_999',
      channels: ['INSTAGRAM', 'TELEGRAM', 'OWN_WEBSITE'],
      targetCountries: ['BR', 'US'],
    });

    expect(res.planId).toBeDefined();
    expect(res.totalPublications).toBe(6); // 3 canais x 2 países
    expect(res.channelsPlanned).toContain('INSTAGRAM');
    expect(res.countriesPlanned).toContain('US');
  });
});
