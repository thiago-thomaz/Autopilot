import { describe, it, expect } from 'vitest';
import { DataSufficiencyEngine } from '../../services/automation/DataSufficiencyEngine';
import { ActionCostEstimator } from '../../services/automation/ActionCostEstimator';
import { PolicyEngine } from '../../services/automation/PolicyEngine';
import { RiskEngine } from '../../services/automation/RiskEngine';
import { RuleEngine } from '../../services/automation/RuleEngine';
import { ActionPlanner } from '../../services/automation/ActionPlanner';
import { AutomationCircuitBreaker } from '../../services/automation/AutomationCircuitBreaker';
import {
  RiskLevel,
  AutonomyLevel,
  PolicyResult,
  DecisionType,
  ActionType,
} from '../../types/automation/automation.types';
import {
  InsufficientDataError,
  KillSwitchActiveError,
} from '../../types/automation/automation.errors';

describe('MÓDULO 8 — AUTONOMOUS OPTIMIZATION & DECISION ENGINE TEST SUITE', () => {
  describe('1. Data Sufficiency Engine', () => {
    const sufficiency = new DataSufficiencyEngine({ minImpressions: 500, minClicks: 50, minConversions: 5 });

    it('should pass if all sample size thresholds are met', () => {
      const result = sufficiency.evaluate({ impressions: 1000, clicks: 100, conversions: 10 });
      expect(result.isSufficient).toBe(true);
    });

    it('should fail and output WAIT_FOR_MORE_DATA if impressions are insufficient', () => {
      const result = sufficiency.evaluate({ impressions: 100, clicks: 10, conversions: 0 });
      expect(result.isSufficient).toBe(false);
      expect(result.reason).toContain('WAIT_FOR_MORE_DATA');
    });

    it('should throw InsufficientDataError on scaling actions when sample is insufficient', () => {
      expect(() => {
        sufficiency.assertSufficiency({ impressions: 100, clicks: 10, conversions: 0 }, 'SCALE_WINNER');
      }).toThrow(InsufficientDataError);
    });
  });

  describe('2. Action Cost Estimator', () => {
    const estimator = new ActionCostEstimator();

    it('should calculate AI generation costs for content tasks', () => {
      const cost = estimator.estimateCost(ActionType.CREATE_CONTENT_TASK, { count: 2 });
      expect(cost.aiCost).toBe(0.10);
      expect(cost.totalCost).toBeGreaterThan(0.10);
    });
  });

  describe('3. Policy Engine', () => {
    const policy = new PolicyEngine();

    it('should allow valid platform actions', () => {
      const res = policy.validatePolicy({ platform: 'INSTAGRAM', actionType: 'UPDATE_PRIORITY', frequencyCount: 2 });
      expect(res.allowed).toBe(true);
      expect(res.result).toBe(PolicyResult.ALLOW);
    });

    it('should deny actions exceeding platform frequency limits', () => {
      const res = policy.validatePolicy({ platform: 'INSTAGRAM', actionType: 'CREATE_PUBLICATION_TASK', frequencyCount: 10 });
      expect(res.allowed).toBe(false);
      expect(res.result).toBe(PolicyResult.DENY);
    });

    it('should AUTOMATICALLY REJECT AI recommendations that violate policy constraints', () => {
      const res = policy.validatePolicy({
        platform: 'WHATSAPP',
        actionType: 'SEND_ALERT',
        hasOptIn: false,
        isAiGeneratedRecommendation: true,
      });

      expect(res.allowed).toBe(false);
      expect(res.result).toBe(PolicyResult.DENY);
      expect(res.violations[0]).toContain('AI recommendation rejected due to compliance violations');
    });
  });

  describe('4. Risk Engine', () => {
    const risk = new RiskEngine();

    it('should calculate risk scores based on decision type and spend', () => {
      const lowRisk = risk.evaluateRisk('PAUSE', 10);
      expect(lowRisk.riskLevel).toBe(RiskLevel.LOW);

      const highRisk = risk.evaluateRisk('SCALE_WINNER', 1000);
      expect([RiskLevel.HIGH, RiskLevel.CRITICAL]).toContain(highRisk.riskLevel);
    });

    it('should enforce autonomy level boundaries', () => {
      expect(risk.isAllowedForAutonomyLevel(RiskLevel.LOW, AutonomyLevel.LEVEL_1_RECOMMEND)).toBe(false);
      expect(risk.isAllowedForAutonomyLevel(RiskLevel.LOW, AutonomyLevel.LEVEL_2_AUTO_LOW_RISK)).toBe(true);
      expect(risk.isAllowedForAutonomyLevel(RiskLevel.MEDIUM, AutonomyLevel.LEVEL_2_AUTO_LOW_RISK)).toBe(false);
    });
  });

  describe('5. Rule Engine & Action Planner', () => {
    const ruleEngine = new RuleEngine();
    const planner = new ActionPlanner();

    it('should generate candidate decisions for high-ROI offers', () => {
      const metrics = {
        impressions: 2000,
        clicks: 200,
        conversions: 10,
        spend: 100,
        revenue: 300,
        commission: 60,
        profit: 200,
        roi: 2.0,
        conversionRate: 0.05,
        sampleSize: 200,
        periodStart: new Date(),
        periodEnd: new Date(),
      };

      const decisions = ruleEngine.evaluateMetrics(metrics);
      expect(decisions.length).toBeGreaterThan(0);
      expect(decisions[0].decisionType).toBe(DecisionType.SCALE_WINNER);
    });

    it('should plan executable action blueprints with rollback steps', () => {
      const decision = {
        scope: 'PRODUCT' as const,
        entityType: 'Product',
        entityId: 'prod-123',
        decisionType: DecisionType.SCALE_WINNER,
        reason: 'High ROI offer',
        confidence: 0.9,
        riskScore: 65,
        priority: 1,
      };

      const blueprint = planner.planAction('dec-1', decision, RiskLevel.HIGH);
      expect(blueprint.steps.length).toBe(2);
      expect(blueprint.rollbackPlan).toBeDefined();
      expect(blueprint.approvalRequired).toBe(true);
    });
  });

  describe('6. Automation Circuit Breaker & Fail-Safe', () => {
    it('should trip global kill switch and reject executions when active', async () => {
      const mockPersistence: any = {
        getHealth: async () => ({ globalKillSwitch: false, circuitBreakerActive: false }),
        updateHealth: async () => {},
      };
      const breaker = new AutomationCircuitBreaker({ persistence: mockPersistence });
      await breaker.setGlobalKillSwitch(true);

      await expect(breaker.checkState()).rejects.toThrow(KillSwitchActiveError);
    });
  });
});
