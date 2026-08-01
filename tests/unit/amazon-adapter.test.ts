import { describe, it, expect, beforeEach } from 'vitest';
import { AmazonAdapter } from '../../services/affiliate/adapters/AmazonAdapter';

describe('AmazonAdapter & AFFILIATE_MOCK_MODE', () => {
  let adapter: AmazonAdapter;

  beforeEach(() => {
    adapter = new AmazonAdapter();
    process.env.AFFILIATE_MOCK_MODE = 'true';
  });

  it('deve retornar as informações e capabilities da Amazon Brasil', () => {
    const info = adapter.getPlatformInfo();
    expect(info.slug).toBe('amazon-brasil');
    expect(info.capabilities.apiAvailable).toBe(true);
    expect(info.capabilities.productDiscoveryAvailable).toBe(true);
  });

  it('deve realizar teste de conexão com sucesso em MOCK_MODE', async () => {
    const res = await adapter.testConnection({ partnerTag: 'meutag-20' });
    expect(res.success).toBe(true);
    expect(res.status).toBe('CONNECTED');
  });

  it('deve retornar lista de produtos normalizados na busca em MOCK_MODE', async () => {
    const products = await adapter.searchProducts('Kindle', { partnerTag: 'meutag-20' });
    expect(products.length).toBeGreaterThan(0);
    expect(products[0].externalId).toBeDefined();
    expect(products[0].currency).toBe('BRL');
    expect(products[0].url).toContain('tag=meutag-20');
  });

  it('deve gerar link de afiliado com partnerTag formatada', async () => {
    const result = await adapter.generateAffiliateLink('https://www.amazon.com.br/dp/B08N5WRWNW', { partnerTag: 'meutag-20' });
    expect(result.manualActionRequired).toBe(false);
    expect(result.affiliateUrl).toContain('tag=meutag-20');
  });

  it('deve retornar produtos de Alimentos e Bebidas ao buscar por termos alimentícios', async () => {
    const products = await adapter.searchProducts('café', { partnerTag: 'meutag-20' });
    expect(products.length).toBeGreaterThan(0);
    const hasFood = products.some(p => p.category === 'Alimentos e Bebidas' || p.title.toLowerCase().includes('café'));
    expect(hasFood).toBe(true);
  });

  it('deve retornar mix de múltiplos departamentos ao buscar com termo em branco/geral', async () => {
    const products = await adapter.searchProducts('todas as ofertas', { partnerTag: 'meutag-20' });
    expect(products.length).toBeGreaterThan(5);
    const categories = new Set(products.map(p => p.category));
    expect(categories.has('Alimentos e Bebidas')).toBe(true);
    expect(categories.has('Casa e Cozinha')).toBe(true);
  });
});
