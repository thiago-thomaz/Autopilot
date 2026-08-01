import { describe, it, expect, vi } from 'vitest';
import { OpportunityEngine } from '../../services/opportunity/OpportunityEngine';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    product: {
      findUnique: vi.fn().mockResolvedValue({
        id: 'prod_test_123',
        externalId: 'B08N5WRWNW',
        title: 'Kindle Paperwhite 16GB',
        description: 'Kindle Paperwhite com luz quente.',
        url: 'https://www.amazon.com.br/dp/B08N5WRWNW',
        imageUrl: 'https://m.media-amazon.com/images/I/61gS9lK8rQL.jpg',
        category: 'Informática',
        brand: 'Amazon',
        currentPrice: 749.0,
        previousPrice: 899.0,
        rating: 4.8,
        reviewCount: 4500,
        availability: true,
        commissionRate: 0.09,
        estimatedCommission: 67.41,
        priceHistory: [{ price: 899.0, capturedAt: new Date(Date.now() - 86400000) }],
      }),
    },
    productBlocklist: { findMany: vi.fn().mockResolvedValue([]) },
    productAllowlist: { findMany: vi.fn().mockResolvedValue([]) },
    $transaction: vi.fn().mockImplementation(async (callback) => callback({
      opportunitySnapshot: { create: vi.fn().mockResolvedValue({ id: 'snap_123' }) },
      product: { update: vi.fn().mockResolvedValue({}) },
      opportunityAlert: { create: vi.fn().mockResolvedValue({}) },
    })),
  },
}));

describe('OpportunityEngine (Orquestrador)', () => {
  it('deve analisar o produto e retornar resultado completo com explicações e versão do algoritmo v1.0.0', async () => {
    const res = await OpportunityEngine.analyzeProduct('prod_test_123');

    expect(res.productId).toBe('prod_test_123');
    expect(res.score).toBeGreaterThan(0);
    expect(res.algorithmVersion).toBe('v1.0.0');
    expect(res.explanation.positives.length).toBeGreaterThan(0);
    expect(res.factorScores.priceScore).toBeDefined();
  });

  it('deve simular score em tempo real sem gravar no banco de dados', () => {
    const sim = OpportunityEngine.simulateScore({
      id: 'sim_1',
      externalId: 'ext_1',
      title: 'Monitor Gamer 144Hz',
      url: 'https://amazon.com.br',
      currentPrice: 899.0,
      previousPrice: 1099.0,
      rating: 4.7,
      reviewCount: 1200,
      availability: true,
      commissionRate: 0.08,
    });

    expect(sim.score).toBeGreaterThan(70);
    expect(sim.classification).toBeDefined();
    expect(sim.explanation).toBeDefined();
  });
});
