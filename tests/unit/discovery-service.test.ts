import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductDiscoveryService } from '../../services/discovery/ProductDiscoveryService';

vi.mock('../../services/discovery/ProductSearchService', () => ({
  ProductSearchService: {
    executeSearch: vi.fn().mockResolvedValue([
      {
        externalId: 'B08N5WRWNW',
        affiliatePlatformId: 'amazon-brasil',
        title: 'Kindle Paperwhite 16GB',
        description: 'Kindle Paperwhite com luz quente.',
        url: 'https://www.amazon.com.br/dp/B08N5WRWNW?tag=demo-20',
        imageUrl: 'https://m.media-amazon.com/images/I/61gS9lK8rQL._AC_SL1500_.jpg',
        category: 'Informática',
        brand: 'Amazon',
        currentPrice: 799.0,
        previousPrice: 899.0,
        currency: 'BRL',
        rating: 4.8,
        reviewCount: 1200,
        availability: true,
      },
    ]),
  },
}));

vi.mock('../../services/discovery/DiscoveryJobService', () => ({
  DiscoveryJobService: {
    createDiscoveryJob: vi.fn().mockResolvedValue({
      search: { id: 'search_mock_123' },
      job: { id: 'job_mock_123' },
    }),
    completeDiscoveryJob: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock('../../services/discovery/ProductDeduplicationService', () => ({
  ProductDeduplicationService: {
    deduplicateBatch: vi.fn().mockImplementation(async (_platform, products) => ({
      uniqueProducts: products,
      duplicateCount: 0,
    })),
    isExistingProduct: vi.fn().mockResolvedValue(false),
  },
}));

vi.mock('../../services/discovery/ProductPersistenceService', () => ({
  ProductPersistenceService: {
    upsertProduct: vi.fn().mockImplementation(async (product, options) => ({
      id: 'prod_mock_123',
      ...product,
      sourceType: options?.sourceType || 'API',
      opportunityScore: 75.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  },
}));

describe('ProductDiscoveryService & Mock Mode', () => {
  beforeEach(() => {
    process.env.AFFILIATE_MOCK_MODE = 'true';
  });

  it('deve executar o fluxo completo de descoberta de produtos com sucesso em MOCK_MODE', async () => {
    const result = await ProductDiscoveryService.discoverProducts({
      platform: 'amazon-brasil',
      query: 'Kindle',
      limit: 5,
    });

    expect(result.success).toBe(true);
    expect(result.platform).toBe('amazon-brasil');
    expect(result.totalFound).toBeGreaterThan(0);
    expect(result.products).toBeDefined();
  }, 15000);

  it('deve aceitar importação manual válida', async () => {
    const manualProd = await ProductDiscoveryService.importManualProduct({
      affiliatePlatformId: 'mercado-livre',
      externalId: `ml_test_${Date.now()}`,
      title: 'Produto Teste Manual Mercado Livre',
      productUrl: 'https://www.mercadolivre.com.br/p/MLB123456',
      currentPrice: 299.9,
      category: 'Ferramentas',
    });

    expect(manualProd).toBeDefined();
    expect(manualProd.title).toContain('Produto Teste Manual');
    expect(manualProd.sourceType).toBe('MANUAL');
  });
});
