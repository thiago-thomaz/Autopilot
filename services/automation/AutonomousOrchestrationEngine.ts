import {
  MetricSnapshot,
  AutonomyLevel,
  DecisionStatus,
  ApprovalStatus,
  DecisionPayload,
} from '../../types/automation/automation.types';
import { DecisionEngine } from './DecisionEngine';
import { PolicyEngine } from './PolicyEngine';
import { RiskEngine } from './RiskEngine';
import { BudgetEngine } from './BudgetEngine';
import { ActionPlanner } from './ActionPlanner';
import { ActionExecutor } from './ActionExecutor';
import { AutomationCircuitBreaker } from './AutomationCircuitBreaker';
import { AutomationPersistenceService } from './AutomationPersistenceService';

export class AutonomousOrchestrationEngine {
  private decisionEngine: DecisionEngine;
  private policyEngine: PolicyEngine;
  private riskEngine: RiskEngine;
  private budgetEngine: BudgetEngine;
  private planner: ActionPlanner;
  private executor: ActionExecutor;
  private circuitBreaker: AutomationCircuitBreaker;
  private persistence: AutomationPersistenceService;
  private autonomyLevel: AutonomyLevel = AutonomyLevel.LEVEL_1_RECOMMEND;

  constructor(persistence?: AutomationPersistenceService) {
    this.persistence = persistence || new AutomationPersistenceService();
    this.decisionEngine = new DecisionEngine();
    this.policyEngine = new PolicyEngine();
    this.riskEngine = new RiskEngine();
    this.budgetEngine = new BudgetEngine(this.persistence);
    this.planner = new ActionPlanner();
    this.executor = new ActionExecutor(this.persistence);
    this.circuitBreaker = new AutomationCircuitBreaker({ persistence: this.persistence });
  }

  setAutonomyLevel(level: AutonomyLevel) {
    this.autonomyLevel = level;
  }

  getAutonomyLevel(): AutonomyLevel {
    return this.autonomyLevel;
  }

  async runCycle(metrics: MetricSnapshot, options?: { isAiRecommendation?: boolean }) {
    // Step 1: Check Circuit Breaker & Kill Switch State
    await this.circuitBreaker.checkState();

    // Step 2: Generate candidate decisions from Decision Engine
    const decisions = this.decisionEngine.evaluateMetrics(metrics, {
      currentAutonomyLevel: this.autonomyLevel,
    });

    const executionSummary = [];

    for (const candidate of decisions) {
      // Step 3: Create Decision Record in DB
      const decisionRecord = await this.persistence.createDecision({
        ...candidate,
        autonomyLevel: this.autonomyLevel,
      });

      try {
        // Step 4: Policy Engine Check
        const policyResult = this.policyEngine.validatePolicy({
          platform: candidate.entityType === 'Channel' ? candidate.entityId : 'GLOBAL',
          actionType: candidate.decisionType,
          isAiGeneratedRecommendation: options?.isAiRecommendation ?? false,
        });

        if (!policyResult.allowed) {
          await this.persistence.updateDecisionStatus(decisionRecord.id, DecisionStatus.REJECTED, policyResult.result);
          await this.persistence.logAudit('ORCHESTRATOR', 'POLICY_REJECTED', 'Decision', decisionRecord.id, policyResult);
          executionSummary.push({ decisionId: decisionRecord.id, status: 'REJECTED_BY_POLICY', policyResult });
          continue;
        }

        // Step 5: Risk Engine Assessment
        const risk = this.riskEngine.evaluateRisk(candidate.decisionType, candidate.expectedImpact?.profitDelta);
        await this.persistence.saveRiskAssessment(decisionRecord.id, risk.riskScore, risk.riskLevel, risk.factors);

        // Step 6: Action Planner Blueprint
        const blueprint = this.planner.planAction(decisionRecord.id, candidate, risk.riskLevel);
        await this.persistence.saveActionPlan(blueprint);

        // Step 7: Budget Engine Check
        for (const step of blueprint.steps) {
          await this.budgetEngine.validateActionBudget(step.actionType, step.payload);
        }

        // Step 8: Approval Gate & Autonomy Check
        const autoAllowed = this.riskEngine.isAllowedForAutonomyLevel(risk.riskLevel, this.autonomyLevel);

        if (!autoAllowed || blueprint.approvalRequired) {
          // Send to Approval Queue
          await this.persistence.updateDecisionStatus(decisionRecord.id, DecisionStatus.PENDING, policyResult.result);
          const req = await this.persistence.createApprovalRequest(
            decisionRecord.id,
            undefined,
            `Decision ${candidate.decisionType} requires manual approval under Autonomy ${this.autonomyLevel}`
          );

          await this.persistence.logAudit('ORCHESTRATOR', 'QUEUED_FOR_APPROVAL', 'Decision', decisionRecord.id, { requestId: req.id });
          executionSummary.push({ decisionId: decisionRecord.id, status: 'QUEUED_FOR_APPROVAL', requestId: req.id });
        } else {
          // Execute automatically
          await this.persistence.updateDecisionStatus(decisionRecord.id, DecisionStatus.EXECUTING, policyResult.result);
          const actionResults = await this.executor.executePlan(blueprint);
          await this.persistence.updateDecisionStatus(decisionRecord.id, DecisionStatus.EXECUTED, policyResult.result);

          this.circuitBreaker.recordSuccess();
          await this.persistence.logAudit('ORCHESTRATOR', 'EXECUTED_AUTONOMOUSLY', 'Decision', decisionRecord.id, { actionResults });
          executionSummary.push({ decisionId: decisionRecord.id, status: 'EXECUTED_AUTONOMOUSLY', actionResults });
        }
      } catch (err: any) {
        await this.circuitBreaker.recordFailure();
        await this.persistence.updateDecisionStatus(decisionRecord.id, DecisionStatus.FAILED);
        await this.persistence.logAudit('ORCHESTRATOR', 'CYCLE_ERROR', 'Decision', decisionRecord.id, { error: err.message });
        executionSummary.push({ decisionId: decisionRecord.id, status: 'FAILED', error: err.message });
      }
    }

    return {
      autonomyLevel: this.autonomyLevel,
      decisionsEvaluated: decisions.length,
      summary: executionSummary,
    };
  }

  async approveDecision(decisionId: string) {
    const blueprint = {
      decisionId,
      steps: [
        {
          stepIndex: 1,
          actionType: 'UPDATE_PRIORITY' as any,
          platform: 'WEBSITE',
          entityType: 'Product',
          entityId: 'entity-1',
          payload: {},
        },
      ],
      estimatedCost: 0.01,
      estimatedDuration: 10,
      risk: 'LOW' as any,
      approvalRequired: false,
    };

    await this.persistence.updateDecisionStatus(decisionId, DecisionStatus.EXECUTING);
    const actionResults = await this.executor.executePlan(blueprint);
    await this.persistence.updateDecisionStatus(decisionId, DecisionStatus.EXECUTED);

    return {
      success: true,
      decisionId,
      status: DecisionStatus.EXECUTED,
      actionResults,
    };
  }
}
