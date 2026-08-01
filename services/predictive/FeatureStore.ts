import { FeatureVector } from '../../types/predictive/features.types';
import { FeatureStoreError } from '../../types/predictive/predictive.errors';

export class FeatureStore {
  private inMemoryStore: Map<string, FeatureVector> = new Map();

  /**
   * Retrieves stored feature vector for a specific entity
   */
  public getFeatureVector(entityId: string): FeatureVector | null {
    return this.inMemoryStore.get(entityId) || null;
  }

  /**
   * Saves or updates a feature vector in the Feature Store
   */
  public saveFeatureVector(vector: FeatureVector): void {
    if (!vector.entityId) {
      throw new FeatureStoreError('Invalid FeatureVector: missing entityId');
    }
    this.inMemoryStore.set(vector.entityId, vector);
  }

  /**
   * Computes feature freshness score based on time decay (1.0 = current, 0.0 = stale > 30 days)
   */
  public calculateFreshness(timestamp: string): number {
    const ageInMs = Date.now() - new Date(timestamp).getTime();
    const ageInDays = ageInMs / (1000 * 60 * 60 * 24);
    if (ageInDays <= 1) return 1.0;
    if (ageInDays >= 30) return 0.0;
    return Math.max(0, 1.0 - (ageInDays / 30));
  }

  /**
   * Clears feature cache (useful for testing)
   */
  public clear(): void {
    this.inMemoryStore.clear();
  }
}
