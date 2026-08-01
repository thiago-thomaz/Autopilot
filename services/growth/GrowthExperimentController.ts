import { GrowthExperimentConfig } from '../../types/growth/campaign.types';
import { ExperimentValidationError } from '../../types/growth/growth.errors';

export interface VariantMetrics {
  variantId: string;
  sampleSize: number;
  conversions: number;
  revenue: number;
  cvr: number;
}

export interface ExperimentEvaluationResult {
  experimentId: string;
  isConclusive: boolean;
  winnerVariantId?: string;
  confidenceAchieved: number;
  liftPercentage: number;
  status: 'RUNNING' | 'COMPLETED' | 'INCONCLUSIVE';
}

export class GrowthExperimentController {
  public validateExperiment(config: GrowthExperimentConfig): boolean {
    if (!config.campaignId) {
      throw new ExperimentValidationError('Experiment requires a valid campaignId');
    }
    if (!config.hypothesis || config.hypothesis.trim().length === 0) {
      throw new ExperimentValidationError('Experiment hypothesis cannot be empty');
    }
    if ((config.minimumSample || 0) < 10) {
      throw new ExperimentValidationError('Minimum sample size must be at least 10');
    }
    return true;
  }

  public evaluateExperiment(
    experiment: GrowthExperimentConfig,
    control: VariantMetrics,
    treatment: VariantMetrics
  ): ExperimentEvaluationResult {
    const minSample = experiment.minimumSample || 100;
    const requiredConfidence = experiment.confidenceThreshold || 0.95;

    if (control.sampleSize < minSample || treatment.sampleSize < minSample) {
      return {
        experimentId: experiment.id || 'exp_unknown',
        isConclusive: false,
        confidenceAchieved: 0,
        liftPercentage: 0,
        status: 'RUNNING'
      };
    }

    const pControl = control.conversions / control.sampleSize;
    const pTreatment = treatment.conversions / treatment.sampleSize;

    const pooledP = (control.conversions + treatment.conversions) / (control.sampleSize + treatment.sampleSize);
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1 / control.sampleSize + 1 / treatment.sampleSize));

    const zScore = se > 0 ? (pTreatment - pControl) / se : 0;
    // Approximate normal CDF for two-tailed p-value
    const confidenceAchieved = Number((1 - Math.exp(-0.7 * zScore * zScore)).toFixed(4));
    const liftPercentage = pControl > 0 ? Number((((pTreatment - pControl) / pControl) * 100).toFixed(2)) : 0;

    const isConclusive = confidenceAchieved >= requiredConfidence && Math.abs(liftPercentage) > 5;
    let winnerVariantId: string | undefined = undefined;

    if (isConclusive) {
      winnerVariantId = pTreatment > pControl ? treatment.variantId : control.variantId;
    }

    return {
      experimentId: experiment.id || 'exp_unknown',
      isConclusive,
      winnerVariantId,
      confidenceAchieved,
      liftPercentage,
      status: isConclusive ? 'COMPLETED' : 'INCONCLUSIVE'
    };
  }
}
