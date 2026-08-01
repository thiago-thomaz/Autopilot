import { AgentType } from '@prisma/client';

export interface AgentOpinion {
  agentType: AgentType;
  vote: 'APPROVE' | 'REJECT' | 'ABSTAIN' | 'MODIFY';
  confidence: number; // 0 to 1
  rationale: string;
  suggestedAdjustments?: Record<string, any>;
}

export interface AgentConsensusResult {
  decisionId: string;
  weightedScore: number; // -1.0 to +1.0
  consensusReached: boolean;
  disagreementScore: number; // 0.0 (full agreement) to 1.0 (high split)
  finalRecommendation: 'PROCEED' | 'HOLD' | 'REQUIRE_APPROVAL' | 'REJECT';
  agentOpinions: AgentOpinion[];
}
