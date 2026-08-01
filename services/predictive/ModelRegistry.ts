import { ModelMetadata } from '../../types/predictive/predictive.types';
import { PredictionModelError } from '../../types/predictive/predictive.errors';

export class ModelRegistry {
  private models: Map<string, ModelMetadata> = new Map();

  constructor() {
    // Register standard default statistical model
    this.registerModel({
      id: 'baseline-cvr-v1',
      name: 'Baseline Statistical CVR Model',
      version: '1.0.0',
      modelType: 'STATISTICAL',
      target: 'CONVERSION',
      features: ['price', 'commissionRate', 'ctr', 'historicalCVR'],
      status: 'ACTIVE',
      metrics: {
        mae: 0.005,
        rmse: 0.008,
        r2Score: 0.78,
        sampleCount: 1500,
        evaluationDate: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    });
  }

  public registerModel(model: ModelMetadata): void {
    this.models.set(model.id, model);
  }

  public getActiveChampion(target: string): ModelMetadata | null {
    for (const model of Array.from(this.models.values())) {
      if (model.target === target && model.status === 'ACTIVE') {
        return model;
      }
    }
    return null;
  }

  public getShadowChallenger(target: string): ModelMetadata | null {
    for (const model of Array.from(this.models.values())) {
      if (model.target === target && model.status === 'SHADOW') {
        return model;
      }
    }
    return null;
  }

  public promoteChallengerToChampion(challengerId: string): void {
    const challenger = this.models.get(challengerId);
    if (!challenger) throw new PredictionModelError(`Model not found: ${challengerId}`);

    const activeChampion = this.getActiveChampion(challenger.target);
    if (activeChampion) {
      activeChampion.status = 'DEPRECATED';
      activeChampion.deprecatedAt = new Date().toISOString();
    }

    challenger.status = 'ACTIVE';
  }

  public rollbackToPreviousChampion(target: string): void {
    const active = this.getActiveChampion(target);
    if (active) {
      active.status = 'DEPRECATED';
    }

    // Find latest deprecated model for target
    const deprecated = Array.from(this.models.values())
      .filter(m => m.target === target && m.status === 'DEPRECATED')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (deprecated.length > 0) {
      deprecated[0].status = 'ACTIVE';
      deprecated[0].deprecatedAt = undefined;
    }
  }

  public listModels(): ModelMetadata[] {
    return Array.from(this.models.values());
  }
}
