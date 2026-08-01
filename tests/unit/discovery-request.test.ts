import { describe, it, expect } from 'vitest';
import { DiscoveryRequestSchema } from '../../types/discovery/discovery.types';

describe('DiscoveryRequestSchema (Validação de Requisição)', () => {
  it('deve validar uma requisição de busca bem formatada', () => {
    const raw = {
      platform: 'amazon-brasil',
      query: 'Kindle',
      limit: 10,
    };
    const result = DiscoveryRequestSchema.safeParse(raw);
    expect(result.success).toBe(true);
  });

  it('deve rejeitar se a query ou a plataforma estiverem ausentes', () => {
    const raw = {
      platform: '',
      query: '',
    };
    const result = DiscoveryRequestSchema.safeParse(raw);
    expect(result.success).toBe(false);
  });

  it('deve limitar o valor máximo de limit em 10 produtos por requisição', () => {
    const raw = {
      platform: 'amazon-brasil',
      query: 'Kindle',
      limit: 50, // Excede o limite máximo
    };
    const result = DiscoveryRequestSchema.safeParse(raw);
    expect(result.success).toBe(false);
  });
});
