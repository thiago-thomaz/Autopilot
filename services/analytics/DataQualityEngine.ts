export class DataQualityEngine {
  public static evaluateDataQuality(totalEvents: number, missingMetadataEvents: number) {
    if (totalEvents === 0) return { qualityScore: 100, status: 'EXCELLENT' };
    const score = Math.max(0, 100 - (missingMetadataEvents / totalEvents) * 100);
    return {
      qualityScore: Number(score.toFixed(1)),
      status: score >= 90 ? 'EXCELLENT' : score >= 70 ? 'GOOD' : 'NEEDS_ATTENTION',
    };
  }
}
