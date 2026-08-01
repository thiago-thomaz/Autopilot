import { describe, it, expect } from 'vitest';
import { RevenueEngine } from '../../services/analytics/RevenueEngine';
import { CostEngine } from '../../services/analytics/CostEngine';
import { ProfitEngine } from '../../services/analytics/ProfitEngine';
import { CurrencyConversionService } from '../../services/analytics/CurrencyConversionService';

describe('Regras Financeiras & Cálculo de Lucro / Câmbio FX', () => {
  it('deve utilizar EXCLUSIVAMENTE a comissão de afiliado como Receita Real', () => {
    const grossProductSale = 1000.0;
    const commission = 80.0;

    const revenue = RevenueEngine.calculateCommissionRevenue(commission, 'BRL');
    expect(revenue).toBe(80.0);
    expect(revenue).not.toBe(grossProductSale);
  });

  it('deve converter USD para BRL usando taxa de câmbio FX sem somar moedas brutas', () => {
    const { amountBase } = CurrencyConversionService.convertToBaseCurrency(10.0, 'USD', 'BRL');
    expect(amountBase).toBe(55.5556); // 10 / 0.18
  });

  it('deve calcular Lucro Líquido (Comissões - Custos) e ROI', () => {
    const revenue = 100.0;
    const costs = 25.0;

    const { netProfit, roi } = ProfitEngine.calculateProfitAndROI(revenue, costs);
    expect(netProfit).toBe(75.0);
    expect(roi).toBe(300.0); // (75 / 25) * 100
  });

  it('deve retornar ROI como null quando o custo for zero para evitar divisão por zero', () => {
    const { netProfit, roi } = ProfitEngine.calculateProfitAndROI(100.0, 0.0);
    expect(netProfit).toBe(100.0);
    expect(roi).toBeNull();
  });
});
