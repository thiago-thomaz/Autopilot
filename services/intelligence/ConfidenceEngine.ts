export class ConfidenceEngine {
  public calculateConfidence(
    evidenceCount: number,
    evidenceReliability: number,
    agentConsensusScore: number,
    dataStability: number = 0.9
  ): number {
    const score = (
      Math.min(1.0, evidenceCount / 5) * 0.3 +
      evidenceReliability * 0.3 +
      agentConsensusScore * 0.2 +
      dataStability * 0.2
    );

    return Number(Math.min(1.0, Math.max(0.1, score)).toFixed(2));
  }
}
