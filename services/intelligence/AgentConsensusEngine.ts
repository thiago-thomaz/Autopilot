import { AgentOpinion, AgentConsensusResult } from '../../types/intelligence/agent.types';

export class AgentConsensusEngine {
  /**
   * Calculates weighted consensus score (-1.0 to +1.0) and disagreement score (0.0 to 1.0).
   * If disagreementScore > 0.35, flags high inter-agent divergence and requires approval.
   */
  public calculateConsensus(decisionId: string, opinions: AgentOpinion[]): AgentConsensusResult {
    if (opinions.length === 0) {
      return {
        decisionId,
        weightedScore: 0,
        consensusReached: false,
        disagreementScore: 1.0,
        finalRecommendation: 'HOLD',
        agentOpinions: []
      };
    }

    let totalWeight = 0;
    let weightedSum = 0;
    let approveCount = 0;
    let rejectCount = 0;

    opinions.forEach((op) => {
      let voteVal = 0;
      if (op.vote === 'APPROVE') {
        voteVal = 1;
        approveCount++;
      } else if (op.vote === 'REJECT') {
        voteVal = -1;
        rejectCount++;
      }

      weightedSum += voteVal * op.confidence;
      totalWeight += op.confidence;
    });

    const weightedScore = Number((totalWeight > 0 ? weightedSum / totalWeight : 0).toFixed(4));
    const disagreementScore = Number(
      (1 - Math.abs(approveCount - rejectCount) / opinions.length).toFixed(4)
    );

    const consensusReached = disagreementScore <= 0.35 && weightedScore > 0.2;

    let finalRecommendation: 'PROCEED' | 'HOLD' | 'REQUIRE_APPROVAL' | 'REJECT' = 'PROCEED';
    if (weightedScore < -0.2) {
      finalRecommendation = 'REJECT';
    } else if (disagreementScore > 0.35) {
      finalRecommendation = 'REQUIRE_APPROVAL';
    } else if (weightedScore <= 0.2) {
      finalRecommendation = 'HOLD';
    }

    return {
      decisionId,
      weightedScore,
      consensusReached,
      disagreementScore,
      finalRecommendation,
      agentOpinions: opinions
    };
  }
}
