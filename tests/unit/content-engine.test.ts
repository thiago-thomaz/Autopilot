import { describe, it, expect, vi } from 'vitest';
import { ContentEngine } from '../../services/content/ContentEngine';

vi.mock('../../lib/prisma', () => ({
  prisma: {
    product: {
      findUnique: vi.fn().mockResolvedValue({
        id: 'prod_mock_555',
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
        opportunitySnapshots: [{ id: 'snap_555' }],
        affiliatePlatform: { slug: 'amazon-brasil' },
      }),
    },
    $transaction: vi.fn().mockImplementation(async (callback) => callback({
      contentPackage: { create: vi.fn().mockResolvedValue({ id: 'pkg_555', status: 'READY_FOR_PUBLICATION' }) },
      contentVersion: { create: vi.fn().mockResolvedValue({ id: 'ver_555' }) },
    })),
  },
}));

describe('ContentEngine & Mock LLM', () => {
  it('deve gerar um pacote de conteúdo completo e aprovar para READY_FOR_PUBLICATION', async () => {
    const res = await ContentEngine.generateContentPackage('prod_mock_555', 'DEAL', 'INSTAGRAM');

    expect(res.package).toBeDefined();
    expect(res.validation.valid).toBe(true);
    expect(res.package.status).toBe('READY_FOR_PUBLICATION');
  });

  it('deve gerar 3 variações de pacotes por oportunidade', async () => {
    const variations = await ContentEngine.generatePackageVariations('prod_mock_555');

    expect(variations.length).toBe(3);
    expect(variations[0].package).toBeDefined();
  });
});
