import { TrueProfitEngine } from './TrueProfitEngine';
import { MarginalReturnEngine } from './MarginalReturnEngine';
import { CampaignSaturationEngine } from './CampaignSaturationEngine';
import { ContentFatigueEngine } from './ContentFatigueEngine';
import { DynamicBudgetAllocator } from './DynamicBudgetAllocator';
import { CampaignBudgetAuction } from './CampaignBudgetAuction';
import { BudgetManager } from './BudgetManager';
import { BudgetReallocationEngine } from './BudgetReallocationEngine';
import { ResourceAllocationEngine } from './ResourceAllocationEngine';
import { CampaignPriorityEngine } from './CampaignPriorityEngine';
import { CampaignPlanner } from './CampaignPlanner';
import { CampaignOrchestrator } from './CampaignOrchestrator';
import { CampaignScheduler } from './CampaignScheduler';
import { CampaignDecisionEngine } from './CampaignDecisionEngine';
import { GrowthExperimentController } from './GrowthExperimentController';
import { CampaignLearningService } from './CampaignLearningService';
import { ContentAtomizationEngine } from './ContentAtomizationEngine';
import { ContentRepurposingEngine } from './ContentRepurposingEngine';
import { GrowthWorkflowEngine } from './GrowthWorkflowEngine';
import { AutonomyGuardrailEngine } from './AutonomyGuardrailEngine';
import { ApprovalEngine } from './ApprovalEngine';
import { StrategicGrowthEngine } from './StrategicGrowthEngine';
import { GrowthPortfolioEngine } from './GrowthPortfolioEngine';
import { GrowthSimulationEngine } from './GrowthSimulationEngine';
import { BudgetSimulationEngine } from './BudgetSimulationEngine';
import { IncrementalityEngine } from './IncrementalityEngine';
import { GrowthFraudDetectionEngine } from './GrowthFraudDetectionEngine';
import { GrowthAdvisor } from './GrowthAdvisor';
import { GrowthPersistenceService } from './GrowthPersistenceService';

export interface AutonomousGrowthLoopResult {
  timestamp: Date;
  status: 'SUCCESS' | 'GUARDRAIL_BLOCKED' | 'SHADOW_SIMULATED' | 'KILL_SWITCH';
  processedOpportunities: number;
  plannedCampaigns: number;
  allocatedBudget: number;
  decisionsMade: number;
  approvalsRequested: number;
  reasons: string[];
}

export class AutonomousGrowthEngine {
  public trueProfitEngine = new TrueProfitEngine();
  public marginalReturnEngine = new MarginalReturnEngine();
  public saturationEngine = new CampaignSaturationEngine();
  public fatigueEngine = new ContentFatigueEngine();
  public budgetAllocator = new DynamicBudgetAllocator();
  public budgetAuction = new CampaignBudgetAuction();
  public budgetManager = new BudgetManager();
  public budgetReallocationEngine = new BudgetReallocationEngine();
  public resourceAllocationEngine = new ResourceAllocationEngine();
  public priorityEngine = new CampaignPriorityEngine();
  public planner = new CampaignPlanner();
  public orchestrator = new CampaignOrchestrator();
  public scheduler = new CampaignScheduler();
  public decisionEngine = new CampaignDecisionEngine();
  public experimentController = new GrowthExperimentController();
  public learningService = new CampaignLearningService();
  public atomizationEngine = new ContentAtomizationEngine();
  public repurposingEngine = new ContentRepurposingEngine();
  public workflowEngine = new GrowthWorkflowEngine();
  public guardrails = new AutonomyGuardrailEngine();
  public approvalEngine = new ApprovalEngine();
  public strategicGrowthEngine = new StrategicGrowthEngine();
  public portfolioEngine = new GrowthPortfolioEngine();
  public growthSimulationEngine = new GrowthSimulationEngine();
  public budgetSimulationEngine = new BudgetSimulationEngine();
  public incrementalityEngine = new IncrementalityEngine();
  public fraudEngine = new GrowthFraudDetectionEngine();
  public advisor = new GrowthAdvisor();
  public persistence = new GrowthPersistenceService();

  /**
   * Executes one iteration of the Autonomous Growth Loop:
   * DISCOVER -> PRIORITIZE -> PLAN -> EXECUTE -> MEASURE -> LEARN -> OPTIMIZE -> SCALE -> REASSESS
   */
  public async runGrowthLoop(opportunities: any[] = []): Promise<AutonomousGrowthLoopResult> {
    const reasons: string[] = [];

    // 1. Guardrail / Kill switch check
    try {
      const guardrailResult = this.guardrails.evaluateAction({
        actionName: 'RUN_GROWTH_LOOP',
        riskLevel: 'MEDIUM'
      });
      if (!guardrailResult.passed && !guardrailResult.shadowModeActive) {
        return {
          timestamp: new Date(),
          status: 'GUARDRAIL_BLOCKED',
          processedOpportunities: 0,
          plannedCampaigns: 0,
          allocatedBudget: 0,
          decisionsMade: 0,
          approvalsRequested: 0,
          reasons: guardrailResult.reasons
        };
      }
      reasons.push(...guardrailResult.reasons);
    } catch (err: any) {
      if (err.name === 'KillSwitchActiveError') {
        return {
          timestamp: new Date(),
          status: 'KILL_SWITCH',
          processedOpportunities: 0,
          plannedCampaigns: 0,
          allocatedBudget: 0,
          decisionsMade: 0,
          approvalsRequested: 0,
          reasons: [err.message]
        };
      }
      throw err;
    }

    // 2. Prioritize Opportunities & Plan Campaigns
    const plannedCampaigns: any[] = [];
    for (const opp of opportunities) {
      const campaign = this.planner.planCampaignFromOpportunity(opp, 100, 'HARVEST');
      const scored = this.priorityEngine.calculatePriority(campaign);
      plannedCampaigns.push(scored);
    }

    // 3. Auction / Allocation
    const bids = plannedCampaigns.map((c) => ({
      campaignId: c.name,
      expectedROI: c.expectedROI || 20,
      expectedNetProfit: c.expectedProfit || 50,
      confidence: c.confidence || 0.8,
      maxRequestedBudget: c.budget || 100,
      riskScore: (c.risk || 0.1) * 100
    }));

    const auctionResult = this.budgetAuction.runAuction(1000, bids);

    // 4. Request approvals if needed for high risk or manual setting
    let approvalsRequested = 0;
    if (this.guardrails.automationLevel === 'SUPERVISED' || this.guardrails.automationLevel === 'MANUAL') {
      for (const win of auctionResult.winningBids) {
        this.approvalEngine.createRequest(
          'CAMPAIGN_PROPOSAL',
          `Autonomous Proposal for ${win.campaignId}`,
          `Allocating ${win.awardedBudget} budget based on auction bid score ${win.bidScore}`,
          'MEDIUM',
          win
        );
        approvalsRequested++;
      }
    }

    return {
      timestamp: new Date(),
      status: this.guardrails.shadowMode ? 'SHADOW_SIMULATED' : 'SUCCESS',
      processedOpportunities: opportunities.length,
      plannedCampaigns: plannedCampaigns.length,
      allocatedBudget: auctionResult.totalDistributed,
      decisionsMade: auctionResult.winningBids.length,
      approvalsRequested,
      reasons
    };
  }
}
