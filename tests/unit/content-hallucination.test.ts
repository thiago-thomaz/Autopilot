import { describe, it, expect } from 'vitest';
import { ContentValidationService } from '../../services/content/ContentValidationService';
import { VerifiedFact } from '../../types/content/content.types';

describe('ContentValidationService (Anti-Hallucination & Claim Validation)', () => {
  it('deve aprovar texto que respeita os fatos oficiais do produto', () => {
    const verifiedFacts: VerifiedFact[] = [
      { type: 'VERIFIED_FACT', key: 'currentPrice', value: 749.0, source: 'Product' },
      { type: 'VERIFIED_FACT', key: 'title', value: 'Kindle Paperwhite', source: 'Product' },
    ];

    const generatedText = 'Aproveite o Kindle Paperwhite em promoção por apenas R$ 749.00 com frete grátis!';
    const result = ContentValidationService.validateClaims(generatedText, verifiedFacts);

    expect(result.valid).toBe(true);
    expect(result.unsupportedClaims.length).toBe(0);
  });

  it('deve rejeitar e sinalizar UNSUPPORTED_CLAIM se o texto alterar o preço do produto', () => {
    const verifiedFacts: VerifiedFact[] = [
      { type: 'VERIFIED_FACT', key: 'currentPrice', value: 749.0, source: 'Product' },
    ];

    const generatedText = 'Compre o Kindle Paperwhite por apenas R$ 499.00!'; // Preço alterado de 749 para 499
    const result = ContentValidationService.validateClaims(generatedText, verifiedFacts);

    expect(result.valid).toBe(false);
    expect(result.unsupportedClaims.length).toBeGreaterThan(0);
    expect(result.unsupportedClaims[0]).toContain('Valor numérico/preço não verificado');
  });

  it('deve rejeitar promessas falsas de lucro ou termos proibidos', () => {
    const verifiedFacts: VerifiedFact[] = [];
    const generatedText = 'Compre este curso e tenha lucro fácil garantido de R$ 5.000 por dia!';
    const result = ContentValidationService.validateClaims(generatedText, verifiedFacts);

    expect(result.valid).toBe(false);
    expect(result.unsupportedClaims.some((c) => c.includes('promessa proibida'))).toBe(true);
  });
});
