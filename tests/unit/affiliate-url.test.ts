import { describe, it, expect } from 'vitest';
import { getSanitizedProductUrl } from '../../lib/utils/url';

describe('Engine de URLs de Afiliado (Anti-404)', () => {
  const DEFAULT_TAG = 'thomazpromos-20';

  it('1. Deve extrair ASIN real e ir direto para a página do produto (/dp/ASIN)', () => {
    const payload = {
      externalId: 'B0B8K3ZSK6',
      title: 'Console PlayStation 5 Slim',
    };
    const result = getSanitizedProductUrl(payload);
    expect(result).toBe(`https://www.amazon.com.br/dp/B0B8K3ZSK6?tag=${DEFAULT_TAG}`);
  });

  it('2. Deve ignorar ASINs de mock conhecidos e forçar busca exata por título', () => {
    const payload = {
      externalId: 'B07XQ8P6S1',
      title: 'Whey Protein Max Titanium',
    };
    const result = getSanitizedProductUrl(payload);
    const expectedQuery = encodeURIComponent('"Whey Protein Max Titanium"');
    expect(result).toBe(`https://www.amazon.com.br/s?k=${expectedQuery}&tag=${DEFAULT_TAG}`);
  });

  it('3. Deve ignorar URLs de busca (/s?k=) salvas no banco de dados e forçar busca por título', () => {
    const payload = {
      url: 'https://www.amazon.com.br/s?k=Whey+Protein&tag=thomazpromos-20',
      title: 'Whey Protein Max Titanium 900g',
    };
    const result = getSanitizedProductUrl(payload);
    const expectedQuery = encodeURIComponent('"Whey Protein Max Titanium 900g"');
    expect(result).toBe(`https://www.amazon.com.br/s?k=${expectedQuery}&tag=${DEFAULT_TAG}`);
  });

  it('4. Deve suportar links e IDs para Mercado Livre e outros marketplaces', () => {
    const payload = {
      externalId: 'MLB12345678',
      platform: 'MERCADO_LIVRE',
    };
    const result = getSanitizedProductUrl(payload);
    expect(result).toBe('https://www.mercadolivre.com.br/p/MLB12345678');
  });

  it('5. Deve fazer fallback para a página inicial com a tag de afiliado se tudo for vazio/inválido', () => {
    const payload = {};
    const result = getSanitizedProductUrl(payload);
    expect(result).toBe(`https://www.amazon.com.br/?tag=${DEFAULT_TAG}`);
  });
});
