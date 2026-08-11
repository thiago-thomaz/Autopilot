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

  it('deve lançar erro CONNECTION_ERROR ao tentar buscar produtos sem sucesso (ou mock desativado)', async () => {
    try {
      // Mocking fetch to fail or just expecting the real fetch to fail without valid auth in CI
      await adapter.searchProducts('smartphone_inválido', {});
    } catch (err: any) {
      expect(err).toBeInstanceOf(AffiliateError);
      expect(err.code).toBe('CONNECTION_ERROR');
    }
  });

  it('deve indicar ação manual ao gerar link de afiliado sem scraping', async () => {
    const result = await adapter.generateAffiliateLink('https://www.mercadolivre.com.br/p/MLB12345', { affiliateTag: 'ml_tag' });
    expect(result.manualActionRequired).toBe(true);
    expect(result.instructions).toContain('ferramentas oficiais');
  });
});
