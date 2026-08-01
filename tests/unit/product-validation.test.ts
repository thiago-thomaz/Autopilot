import { describe, it, expect } from 'vitest';
import { ProductValidationService } from '../../services/discovery/ProductValidationService';

describe('ProductValidationService', () => {
  it('deve aprovar um produto com dados corretos', () => {
    const res = ProductValidationService.validateProduct({
      externalId: 'ASIN123',
      affiliatePlatformId: 'amazon-brasil',
      title: 'Kindle Paperwhite',
      url: 'https://www.amazon.com.br/dp/ASIN123',
      currentPrice: 799.0,
      currency: 'BRL',
      availability: true,
    });
    expect(res.valid).toBe(true);
  });

  it('deve rejeitar produtos com preço menor ou igual a zero', () => {
    const res = ProductValidationService.validateProduct({
      externalId: 'ASIN123',
      affiliatePlatformId: 'amazon-brasil',
      title: 'Kindle Paperwhite',
      url: 'https://www.amazon.com.br/dp/ASIN123',
      currentPrice: -10.0,
      currency: 'BRL',
      availability: true,
    });
    expect(res.valid).toBe(false);
    expect(res.reason).toBe('INVALID_PRICE');
  });

  it('deve rejeitar produtos com URL inválida', () => {
    const res = ProductValidationService.validateProduct({
      externalId: 'ASIN123',
      affiliatePlatformId: 'amazon-brasil',
      title: 'Kindle Paperwhite',
      url: 'invalid-url-string',
      currentPrice: 100.0,
      currency: 'BRL',
      availability: true,
    });
    expect(res.valid).toBe(false);
    expect(res.reason).toBe('INVALID_URL');
  });
});
