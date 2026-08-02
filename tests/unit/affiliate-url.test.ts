import { describe, it, expect } from 'vitest';
import { getSanitizedProductUrl } from '../../lib/utils/url';

describe('Engine de URLs de Afiliado (Anti-404)', () => {
  const DEFAULT_TAG = 'thomazpromos-20';

  it('1. Deve usar a URL de afiliado/original se fornecida e válida, injetando a tag se for Amazon', () => {
    const payload = {
      url: 'https://www.amazon.com.br/dp/B0B8K3ZSK6',
    };
    const result = getSanitizedProductUrl(payload);
    expect(result).toBe(`https://www.amazon.com.br/dp/B0B8K3ZSK6?tag=${DEFAULT_TAG}`);
  });

  it('2. Deve substituir ASINs obsoletos conhecidos na URL', () => {
    const payload = {
      url: 'https://www.amazon.com.br/dp/B092DC27PN', // Obsoleto
    };
    const result = getSanitizedProductUrl(payload);
    expect(result).toBe(`https://www.amazon.com.br/dp/B0B8K3ZSK6?tag=${DEFAULT_TAG}`);
  });

  it('3. Deve usar externalId/ASIN se for fornecido direto sem URL', () => {
    const payload = {
      externalId: 'B0B8K3ZSK6',
    };
    const result = getSanitizedProductUrl(payload);
    expect(result).toBe(`https://www.amazon.com.br/dp/B0B8K3ZSK6?tag=${DEFAULT_TAG}`);
  });

  it('4. Deve suportar links diretos de Mercado Livre e outras plataformas se o ID e a plataforma forem definidos', () => {
    const payload = {
      externalId: 'MLB12345678',
      platform: 'MERCADO_LIVRE',
    };
    const result = getSanitizedProductUrl(payload);
    expect(result).toBe('https://www.mercadolivre.com.br/p/MLB12345678');
  });

  it('5. Deve fazer fallback de busca real pelo título se não houver URL nem ID válido (Anti-404)', () => {
    const payload = {
      title: 'Console PlayStation 5 Slim',
    };
    const result = getSanitizedProductUrl(payload);
    const expectedQuery = encodeURIComponent('Console PlayStation 5 Slim');
    expect(result).toBe(`https://www.amazon.com.br/s?k=${expectedQuery}&tag=${DEFAULT_TAG}`);
  });

  it('6. Deve fazer fallback para a página inicial com a tag de afiliado se tudo for vazio/inválido', () => {
    const payload = {};
    const result = getSanitizedProductUrl(payload);
    expect(result).toBe(`https://www.amazon.com.br/?tag=${DEFAULT_TAG}`);
  });
});
