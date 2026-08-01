import { ModelMetrics } from '../../types/predictive/predictive.types';

export interface ModelDriftReport {
  hasDrift: boolean;
  driftMagnitude: number; // percentage degradation
  currentMAE: number;
  baselineMAE: number;
  recommendation: 'NONE' | 'TRIGGER_SHADOW_TRAINING' | 'FORCE_ROLLBACK';
}

export class ModelDriftDetector {
  private readonly DRIFT_THRESHOLD = 0.25; // 25% degradation threshold

  public detectModelDrift(baselineMetrics: ModelMetrics, currentMetrics: ModelMetrics): ModelDriftReport {
    const baseMAE = baselineMetrics.mae || 0.005;
    const currMAE = currentMetrics.mae || 0.005;

    const degradation = (currMAE - baseMAE) / baseMAE;
    const hasDrift = degradation > this.DRIFT_THRESHOLD;

    let recommendation: 'NONE' | 'TRIGGER_SHADOW_TRAINING' | 'FORCE_ROLLBACK' = 'NONE';
    if (degradation > 0.50) {
      recommendation = 'FORCE_ROLLBACK';
    } else if (hasDrift) {
      recommendation = 'TRIGGER_SHADOW_TRAINING';
    }

    return {
      hasDrift,
      driftMagnitude: Number((degradation * 100).toFixed(2)),
      currentMAE: currMAE,
      baselineMAE: baseMAE,
      recommendation
    };
  }
}
