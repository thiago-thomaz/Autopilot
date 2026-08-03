import { describe, it, expect } from 'vitest';
import { getSanitizedProductUrl } from '../../lib/utils/url';

describe('Engine de URLs de Afiliado (Anti-404)', () => {
  const DEFAULT_TAG = 'thomazpromos-20';

  it('1. Deve ignorar links diretos da Amazon (/dp/) e fazer fallback de busca pelo título se fornecido', () => {
    const payload = {
      url: 'https://www.amazon.com.br/dp/B0B8K3ZSK6',
      title: 'Console PlayStation 5 Slim',
    };
    const result = getSanitizedProductUrl(payload);
    const expectedQuery = encodeURIComponent('Console PlayStation 5 Slim');
    expect(result).toBe(`https://www.amazon.com.br/s?k=${expectedQuery}&tag=${DEFAULT_TAG}`);
  });

  it('2. Deve ignorar links diretos da Amazon (/gp/) e cair na página inicial se não houver título', () => {
    const payload = {
      url: 'https://www.amazon.com.br/gp/product/B092DC27PN',
    };
    const result = getSanitizedProductUrl(payload);
    expect(result).toBe(`https://www.amazon.com.br/?tag=${DEFAULT_TAG}`);
  });

  it('3. Deve usar URLs que não sejam da Amazon diretamente (ex: Mercado Livre)', () => {
    const payload = {
      url: 'https://www.mercadolivre.com.br/p/MLB12345678',
    };
    const result = getSanitizedProductUrl(payload);
    expect(result).toBe('https://www.mercadolivre.com.br/p/MLB12345678');
  });

  it('4. Deve construir links diretos para Mercado Livre e outras plataformas a partir do ID se a plataforma for definida', () => {
    const payload = {
      externalId: 'MLB12345678',
      platform: 'MERCADO_LIVRE',
    };
    const result = getSanitizedProductUrl(payload);
    expect(result).toBe('https://www.mercadolivre.com.br/p/MLB12345678');
  });

  it('5. Deve fazer fallback de busca real pelo título se não houver URL válida', () => {
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
