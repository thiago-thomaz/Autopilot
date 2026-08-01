import { describe, it, expect } from 'vitest';
import { AnomalyDetectionEngine } from '../../services/analytics/AnomalyDetectionEngine';
import { RecommendationEngine } from '../../services/analytics/RecommendationEngine';

describe('AnomalyDetectionEngine & RecommendationEngine', () => {
  it('deve disparar alertas de queda no CTR e surto de custos', () => {
    const alerts = AnomalyDetectionEngine.detectAnomalies(1.0, 5.0, 500.0, 100.0);
    expect(alerts.length).toBe(2);
    expect(alerts[0].type).toBe('CTR_DROP');
    expect(alerts[1].type).toBe('COST_SPIKE');
  });

  it('deve gerar recomendação INCREASE_PRIORITY para produtos com alto ROI e CVR', () => {
    const signals = RecommendationEngine.generateSignals([
      { productId: 'prod_best', roi: 250, cvr: 4.5 },
      { productId: 'prod_bad', roi: -80, cvr: 0.2 },
    ]);

    expect(signals.length).toBe(2);
    expect(signals[0].type).toBe('INCREASE_PRIORITY');
    expect(signals[1].type).toBe('PAUSE');
  });
});
