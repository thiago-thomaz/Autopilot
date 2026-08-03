import { describe, it, expect } from 'vitest';
import { getSanitizedProductUrl } from '../../lib/utils/url';

describe('Engine de URLs de Afiliado (Anti-404)', () => {
  const DEFAULT_TAG = 'thomazpromos-20';

  it('1. Deve traduzir o ASIN de mock do Café Orfeu (B07XQ8P6S1) para o ASIN real (B077BG228H) e ir direto', () => {
    const payload = {
      externalId: 'B07XQ8P6S1',
      title: 'Café Torrado e Moído Orfeu Gourmet Intenso 250g',
    };
    const result = getSanitizedProductUrl(payload);
    expect(result).toBe(`https://www.amazon.com.br/dp/B077BG228H?tag=${DEFAULT_TAG}`);
  });

  it('2. Deve traduzir o ASIN de mock do Whey (B07MSLFF61) para o ASIN real (B08S3P3GCS) e ir direto', () => {
    const payload = {
      externalId: 'B07MSLFF61',
      title: 'Whey Protein Max Titanium 900g',
    };
    const result = getSanitizedProductUrl(payload);
    expect(result).toBe(`https://www.amazon.com.br/dp/B08S3P3GCS?tag=${DEFAULT_TAG}`);
  });

  it('3. Deve fazer busca pelo título sem aspas se for um produto sem ASIN de 10 caracteres', () => {
    const payload = {
      title: 'Console PlayStation 5 Slim',
    };
    const result = getSanitizedProductUrl(payload);
    const expectedQuery = encodeURIComponent('Console PlayStation 5 Slim');
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
