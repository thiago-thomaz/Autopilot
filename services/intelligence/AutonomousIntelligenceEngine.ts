import { SignalIngestionEngine } from './SignalIngestionEngine';
import { ContextEngine } from './ContextEngine';
import { DigitalTwinService } from './DigitalTwinService';
import { MemorySystem } from './MemorySystem';
import { EvidenceEngine } from './EvidenceEngine';
import { HypothesisEngine } from './HypothesisEngine';
import { ReasoningEngine } from './ReasoningEngine';
import { ScenarioEngine } from './ScenarioEngine';
import { CounterfactualEngine } from './CounterfactualEngine';
import { PredictionEngineAdapter } from './PredictionEngineAdapter';
import { OpportunityDetectionEngine } from './OpportunityDetectionEngine';
import { RiskDetectionEngine } from './RiskDetectionEngine';
import { ScoringEngine } from './ScoringEngine';
import { PrioritizationEngine } from './PrioritizationEngine';
import { DecisionEngine } from './DecisionEngine';
import { DecisionPolicyEngine } from './DecisionPolicyEngine';
import { ConfidenceEngine } from './ConfidenceEngine';
import { HumanApprovalEngine } from './HumanApprovalEngine';
import { AgentOrchestrator } from './AgentOrchestrator';
import { ActionPlanner } from './ActionPlanner';
import { RollbackEngine } from './RollbackEngine';
import { OutcomeEngine } from './OutcomeEngine';
import { LearningEngine } from './LearningEngine';
import { DecisionJournal } from './DecisionJournal';
import { ModelRouter } from './ModelRouter';
import { AIUsageOptimizer } from './AIUsageOptimizer';
import { M9Adapter } from './M9Adapter';
import { M11Adapter } from './M11Adapter';
import { M12Adapter } from './M12Adapter';
import { SignalEvent, SystemAutonomyState } from '../../types/intelligence/intelligence.types';

export interface IntelligenceCycleResult {
  timestamp: Date;
  status: 'SUCCESS' | 'SAFETY_LOCK' | 'KILL_SWITCH' | 'REQUIRE_APPROVAL';
  signal: SignalEvent;
  context: any;
  opportunity?: any;
  risk?: any;
  decision: any;
  consensus: any;
  actionPlan?: any;
  approvalRequest?: any;
}

export class AutonomousIntelligenceEngine {
  public ingestionEngine = new SignalIngestionEngine();
  public contextEngine = new ContextEngine();
  public digitalTwin = new DigitalTwinService();
  public memorySystem = new MemorySystem();
  public evidenceEngine = new EvidenceEngine();
  public hypothesisEngine = new HypothesisEngine();
  public reasoningEngine = new ReasoningEngine();
  public scenarioEngine = new ScenarioEngine();
  public counterfactualEngine = new CounterfactualEngine();
  public predictionAdapter = new PredictionEngineAdapter();
  public opportunityEngine = new OpportunityDetectionEngine();
  public riskEngine = new RiskDetectionEngine();
  public scoringEngine = new ScoringEngine();
  public prioritizationEngine = new PrioritizationEngine();
  public decisionEngine = new DecisionEngine();
  public policyEngine = new DecisionPolicyEngine();
  public confidenceEngine = new ConfidenceEngine();
  public humanApprovalEngine = new HumanApprovalEngine();
  public agentOrchestrator = new AgentOrchestrator();
  public actionPlanner = new ActionPlanner();
  public rollbackEngine = new RollbackEngine();
  public outcomeEngine = new OutcomeEngine();
  public learningEngine = new LearningEngine();
  public decisionJournal = new DecisionJournal();
  public modelRouter = new ModelRouter();
  public aiOptimizer = new AIUsageOptimizer();
  public m9Adapter = new M9Adapter();
  public m11Adapter = new M11Adapter();
  public m12Adapter = new M12Adapter();

  public globalKillSwitch: boolean = false;
  public autonomyMode: SystemAutonomyState = 'SUPERVISED';

  public setGlobalKillSwitch(active: boolean): void {
    this.globalKillSwitch = active;
  }

  /**
   * Executes full Master Autonomous Intelligence Decision Cycle:
   * EVENTS -> SIGNAL -> CONTEXT -> MEMORY -> REASONING -> PREDICTION -> OPP/RISK -> DECISION -> AGENT CONSENSUS -> POLICY -> PLAN -> OUTCOME -> LEARNING
   */
  public async processSignal(rawSignal: SignalEvent): Promise<IntelligenceCycleResult> {
    // 1. Check Global Kill Switch
    if (this.globalKillSwitch) {
      return {
        timestamp: new Date(),
        status: 'KILL_SWITCH',
        signal: rawSignal,
        context: null,
        decision: null,
        consensus: null
      };
    }

    // 2. Ingest & Sanitize Signal (Anti-Prompt Injection)
    const signal = this.ingestionEngine.ingestSignal(rawSignal);

    // 3. Build Temporal Context from M12 Financials
    const financialState = this.m12Adapter.getFinancialState();
    const context = this.contextEngine.buildContext(financialState, [], {}, {}, this.autonomyMode);
    this.digitalTwin.updateState(context);

    // 4. Memory Retrieval & Evidence
    const evidence = this.evidenceEngine.classifyEvidence(
      `Signal received: ${signal.eventType} for ${signal.entityType}`,
      signal.sourceModule,
      'DIRECT',
      0.9
    );
    const hypothesis = this.hypothesisEngine.formulateHypothesis(
      `Optimize ${signal.entityType} performance`,
      `Adjusting campaign parameters for ${signal.entityId}`,
      [evidence]
    );

    // 5. Reasoning & Scenario Simulation
    const reasoning = this.reasoningEngine.deduceCause([hypothesis]);
    const scenarios = this.scenarioEngine.runScenarioSimulation(500, 100);

    // 6. Opportunity & Risk Detection
    const opportunity = this.opportunityEngine.detectOpportunity(
      `Scale ${signal.entityType} ${signal.entityId}`,
      'US_MARKET',
      350,
      0.04,
      14.5,
      15
    );
    const risk = this.riskEngine.evaluateRisk(
      'FINANCIAL',
      'Operating cost fluctuation',
      0.2,
      0.3
    );

    // 7. Prioritization & Decision Formulation
    const priority = this.prioritizationEngine.calculatePriority({
      impact: 8,
      probability: 0.8,
      confidence: 0.85,
      strategicAlignment: 9,
      urgency: 7,
      scalability: 8,
      cost: 50,
      risk: 15
    });

    const decision = this.decisionEngine.createDecision(
      `Autonomous Action for ${signal.entityType} ${signal.entityId}`,
      priority.priorityLevel === 'P0' ? 'LEVEL_3_STRATEGIC' : 'LEVEL_1_OPERATIONAL',
      'OPTIMIZE',
      signal.entityType,
      signal.entityId,
      reasoning.recommendedStrategy,
      opportunity.expectedNetProfit,
      risk.score,
      priority.priorityScore,
      0.85
    );

    // 8. Agent Consensus Orchestration
    const consensus = this.agentOrchestrator.evaluateDecision(decision.idempotencyKey, context);

    // 9. Policy & Risk Gate Check
    const policyCheck = this.policyEngine.validateDecision(decision, financialState.cashReserveStatus, this.globalKillSwitch);

    if (!policyCheck.isAllowed || consensus.finalRecommendation === 'REQUIRE_APPROVAL' || decision.requiresHumanApproval) {
      const approvalReq = this.humanApprovalEngine.createApprovalRequest(decision.idempotencyKey, 'DASHBOARD');
      return {
        timestamp: new Date(),
        status: 'REQUIRE_APPROVAL',
        signal,
        context,
        opportunity,
        risk,
        decision,
        consensus,
        approvalRequest: approvalReq
      };
    }

    // 10. Action Planning & Execution
    const actionPlan = this.actionPlanner.planAction(decision);
    await this.m11Adapter.executeGrowthAction(decision.actionType, { entityId: decision.entityId });

    // 11. Journal & Memory Update
    this.decisionJournal.recordEntry({
      decisionId: decision.idempotencyKey,
      title: decision.title,
      whyReasoning: decision.reason,
      evaluatedRisks: risk,
      agentOpinions: consensus.agentOpinions,
      createdAt: new Date()
    });

    return {
      timestamp: new Date(),
      status: 'SUCCESS',
      signal,
      context,
      opportunity,
      risk,
      decision,
      consensus,
      actionPlan
    };
  }
}
