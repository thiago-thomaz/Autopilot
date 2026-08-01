import { describe, it, expect } from 'vitest';
import { LocalizationEngine } from '../../services/publication/LocalizationEngine';

describe('LocalizationEngine (Conversão de Moedas e Formatação Local)', () => {
  it('deve converter BRL para USD utilizando a taxa de câmbio', () => {
    const { convertedAmount, currency } = LocalizationEngine.convertCurrency(100.0, 'BRL', 'USD');
    expect(convertedAmount).toBe(18.0); // 100 * 0.18
    expect(currency).toBe('USD');
  });

  it('deve formatar valores em BRL com vírgula decimal e símbolo R$', () => {
    const formatted = LocalizationEngine.formatPrice(749.9, 'BRL', 'pt-BR');
    expect(formatted).toBe('R$ 749,90');
  });

  it('deve formatar valores em USD com ponto decimal e símbolo $', () => {
    const formatted = LocalizationEngine.formatPrice(134.98, 'USD', 'en-US');
    expect(formatted).toBe('$134.98');
  });
});
