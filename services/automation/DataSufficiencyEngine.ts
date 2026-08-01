import { MetricSnapshot, DataSufficiencyCheck } from '../../types/automation/automation.types';
import { InsufficientDataError } from '../../types/automation/automation.errors';

export class DataSufficiencyEngine {
  private minImpressions: number;
  private minClicks: number;
  private minConversions: number;

  constructor(options?: { minImpressions?: number; minClicks?: number; minConversions?: number }) {
    this.minImpressions = options?.minImpressions ?? 500;
    this.minClicks = options?.minClicks ?? 50;
    this.minConversions = options?.minConversions ?? 5;
  }

  evaluate(metrics: Partial<MetricSnapshot>): DataSufficiencyCheck {
    const impressions = metrics.impressions ?? 0;
    const clicks = metrics.clicks ?? 0;
    const conversions = metrics.conversions ?? 0;

    if (impressions < this.minImpressions) {
      return {
        isSufficient: false,
        minimumSample: this.minImpressions,
        currentSample: impressions,
        missingMetric: 'impressions',
        reason: `WAIT_FOR_MORE_DATA: Impressions (${impressions}) below minimum required (${this.minImpressions})`,
      };
    }

    if (clicks < this.minClicks) {
      return {
        isSufficient: false,
        minimumSample: this.minClicks,
        currentSample: clicks,
        missingMetric: 'clicks',
        reason: `WAIT_FOR_MORE_DATA: Clicks (${clicks}) below minimum required (${this.minClicks})`,
      };
    }

    if (conversions < this.minConversions) {
      return {
        isSufficient: false,
        minimumSample: this.minConversions,
        currentSample: conversions,
        missingMetric: 'conversions',
        reason: `WAIT_FOR_MORE_DATA: Conversions (${conversions}) below minimum required (${this.minConversions})`,
      };
    }

    return {
      isSufficient: true,
      minimumSample: this.minConversions,
      currentSample: conversions,
    };
  }

  assertSufficiency(metrics: Partial<MetricSnapshot>, actionType: string) {
    const check = this.evaluate(metrics);
    if (!check.isSufficient) {
      // Scale or Pause action types cannot proceed with insufficient data
      if (['SCALE_WINNER', 'PAUSE', 'STOP_UNPROFITABLE', 'INCREASE_DISTRIBUTION'].includes(actionType)) {
        throw new InsufficientDataError(check.reason, check);
      }
    }
    return check;
  }
}
