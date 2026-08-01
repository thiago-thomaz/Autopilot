import { AttributionModel } from '@prisma/client';
import { Touchpoint, AttributionResult } from '../../types/analytics/analytics.types';

export class AttributionEngine {
  /**
   * Distribui os créditos de uma conversão entre os pontos de contato da jornada sem duplicar o valor da comissão.
   */
  public static attributeConversion(
    conversionId: string,
    commissionRevenue: number,
    totalProfit: number,
    touchpoints: Touchpoint[],
    model: AttributionModel = 'LAST_CLICK'
  ): AttributionResult {
    if (touchpoints.length === 0) {
      return { conversionId, model, touchpoints: [] };
    }

    const n = touchpoints.length;
    const credits: number[] = new Array(n).fill(0);

    if (model === 'LAST_CLICK') {
      credits[n - 1] = 1.0;
    } else if (model === 'FIRST_CLICK') {
      credits[0] = 1.0;
    } else if (model === 'LINEAR') {
      const share = 1.0 / n;
      for (let i = 0; i < n; i++) credits[i] = share;
    } else if (model === 'POSITION_BASED') {
      if (n === 1) {
        credits[0] = 1.0;
      } else if (n === 2) {
        credits[0] = 0.5;
        credits[1] = 0.5;
      } else {
        credits[0] = 0.4;
        credits[n - 1] = 0.4;
        const middleShare = 0.2 / (n - 2);
        for (let i = 1; i < n - 1; i++) credits[i] = middleShare;
      }
    } else if (model === 'TIME_DECAY') {
      let totalWeight = 0;
      const weights = touchpoints.map((_, i) => Math.pow(2, i));
      totalWeight = weights.reduce((a, b) => a + b, 0);
      for (let i = 0; i < n; i++) credits[i] = weights[i] / totalWeight;
    }

    const attributedTouchpoints = touchpoints.map((tp, idx) => {
      const credit = Number(credits[idx].toFixed(4));
      return {
        touchpointId: tp.id,
        channel: tp.channel,
        credit,
        attributedCommission: Number((commissionRevenue * credit).toFixed(4)),
        attributedProfit: Number((totalProfit * credit).toFixed(4)),
      };
    });

    return {
      conversionId,
      model,
      touchpoints: attributedTouchpoints,
    };
  }
}
