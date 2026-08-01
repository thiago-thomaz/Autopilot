import { FeatureVector } from '../../types/predictive/features.types';

export class ProductSimilarityEngine {
  /**
   * Calculates cosine similarity between two product feature vectors (range: 0.0 to 1.0)
   */
  public calculateCosineSimilarity(v1: FeatureVector, v2: FeatureVector): number {
    const keys1 = Object.keys(v1.features).filter(k => typeof v1.features[k] === 'number');
    const keys2 = Object.keys(v2.features).filter(k => typeof v2.features[k] === 'number');
    const commonKeys = keys1.filter(k => keys2.includes(k));

    if (commonKeys.length === 0) return 0.0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const key of commonKeys) {
      const val1 = Number(v1.features[key]);
      const val2 = Number(v2.features[key]);
      dotProduct += val1 * val2;
      normA += val1 * val1;
      normB += val2 * val2;
    }

    if (normA === 0 || normB === 0) return 0.0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Finds top K similar products for a target vector from candidate set
   */
  public findTopSimilarProducts(
    targetVector: FeatureVector,
    candidates: FeatureVector[],
    topK: number = 5
  ): Array<{ vector: FeatureVector; similarityScore: number }> {
    return candidates
      .filter(c => c.entityId !== targetVector.entityId)
      .map(candidate => ({
        vector: candidate,
        similarityScore: this.calculateCosineSimilarity(targetVector, candidate)
      }))
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, topK);
  }
}
