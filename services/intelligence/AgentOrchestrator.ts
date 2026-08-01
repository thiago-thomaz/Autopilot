import {
  MarketIntelligenceAgent,
  ProductIntelligenceAgent,
  ContentIntelligenceAgent,
  ChannelIntelligenceAgent,
  AffiliateIntelligenceAgent,
  FinancialIntelligenceAgent,
  RiskComplianceAgent,
  ExperimentationAgent,
  GrowthAgent,
  StrategyAgent
} from './SpecializedAgents';
import { AgentConsensusEngine } from './AgentConsensusEngine';
import { AgentConsensusResult } from '../../types/intelligence/agent.types';

export class AgentOrchestrator {
  private agents = [
    new MarketIntelligenceAgent(),
    new ProductIntelligenceAgent(),
    new ContentIntelligenceAgent(),
    new ChannelIntelligenceAgent(),
    new AffiliateIntelligenceAgent(),
    new FinancialIntelligenceAgent(),
    new RiskComplianceAgent(),
    new ExperimentationAgent(),
    new GrowthAgent(),
    new StrategyAgent()
  ];

  private consensusEngine = new AgentConsensusEngine();

  public evaluateDecision(decisionId: string, context: any): AgentConsensusResult {
    const opinions = this.agents.map((agent) => agent.evaluate(context));
    return this.consensusEngine.calculateConsensus(decisionId, opinions);
  }
}
