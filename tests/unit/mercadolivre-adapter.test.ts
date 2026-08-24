import { describe, it, expect, beforeEach } from 'vitest';
import { MercadoLivreAdapter } from '../../services/affiliate/adapters/MercadoLivreAdapter';
import { AffiliateError } from '../../services/affiliate/types/affiliate.errors';

describe('MercadoLivreAdapter', () => {
  let adapter: MercadoLivreAdapter;

  beforeEach(() => {
    adapter = new MercadoLivreAdapter();
    process.env.AFFILIATE_MOCK_MODE = 'false';
  });

  it('deve retornar as informações e capabilities da plataforma Mercado Livre', () => {
    const info = adapter.getPlatformInfo();
    expect(info.slug).toBe('mercado-livre');
    expect(info.capabilities.apiAvailable).toBe(true);
    expect(info.capabilities.manualLinkGenerationOnly).toBe(true);
  });

  it('deve retornar status MANUAL_REQUIRED no teste de conexão', async () => {
    const res = await adapter.testConnection({ affiliateTag: 'ml_tag_123' });
    expect(res.success).toBe(true);
    expect(res.status).toBe('MANUAL_REQUIRED');
    expect(res.message).toContain('MANUAL_LINK_GENERATION');
  });

  it('deve retornar resultado fallback (anti-403 resiliente) ao buscar produtos sem sucesso', async () => {
    // O MercadoLivreAdapter tem fallback resiliente: nunca lanca AffiliateError,
    // retorna um produto generico apontando para a busca no ML quando a API falha.
    // Mock fetch para falhar imediatamente
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => { throw new Error('Network request blocked in test environment'); };
    try {
      const result = await adapter.searchProducts('smartphone_invalido', {});
      // Deve retornar array nao vazio com o produto fallback
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].affiliatePlatformId).toBe('mercado-livre');
      expect(result[0].url).toContain('mercadolivre.com.br');
    } finally {
      globalThis.fetch = originalFetch;
    }
  }, 10000);


  it('deve indicar ação manual ao gerar link de afiliado sem scraping', async () => {
    const result = await adapter.generateAffiliateLink('https://www.mercadolivre.com.br/p/MLB12345', { affiliateTag: 'ml_tag' });
    expect(result.manualActionRequired).toBe(true);
    expect(result.instructions).toContain('ferramentas oficiais');
  });
});
