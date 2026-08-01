import { ModelRegistry } from './ModelRegistry';
import { BaselinePredictionModel } from './BaselinePredictionModel';
import { FeatureVector } from '../../types/predictive/features.types';
import { PredictionResult } from '../../types/predictive/predictive.types';

export class ModelRouter {
  private registry: ModelRegistry;
  private baselineModel: BaselinePredictionModel;

  constructor(registry: ModelRegistry) {
    this.registry = registry;
    this.baselineModel = new BaselinePredictionModel();
  }

  public routePrediction(target: string, featureVector: FeatureVector): PredictionResult {
    try {
      const activeChampion = this.registry.getActiveChampion(target);
      if (!activeChampion) {
        // Fallback to baseline statistical model
        return this.baselineModel.predict(featureVector);
      }
      return this.baselineModel.predict(featureVector);
    } catch {
      // Automatic Circuit Breaker Fallback
      return this.baselineModel.predict(featureVector);
    }
  }
}
