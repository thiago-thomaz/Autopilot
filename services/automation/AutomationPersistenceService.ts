import { PrismaClient, Prisma } from '@prisma/client';
import {
  DecisionPayload,
  ActionPlanBlueprint,
  MetricSnapshot,
  AutonomyLevel,
  DecisionStatus,
  ActionStatus,
  ApprovalStatus,
} from '../../types/automation/automation.types';

export class AutomationPersistenceService {
  private prisma: PrismaClient;

  constructor(prismaInstance?: PrismaClient) {
    this.prisma = prismaInstance || new PrismaClient();
  }

  async createDecision(payload: DecisionPayload) {
    return await this.prisma.decision.create({
      data: {
        scope: payload.scope,
        entityType: payload.entityType,
        entityId: payload.entityId,
        decisionType: payload.decisionType,
        reason: payload.reason,
        confidence: payload.confidence,
        expectedImpact: (payload.expectedImpact || {}) as Prisma.InputJsonValue,
        riskScore: payload.riskScore,
        priority: payload.priority,
        autonomyLevel: payload.autonomyLevel || AutonomyLevel.LEVEL_1_RECOMMEND,
        status: DecisionStatus.PENDING,
        policyResult: 'UNKNOWN',
        approvalRequired: true,
      },
    });
  }

  async updateDecisionStatus(decisionId: string, status: DecisionStatus, policyResult?: any) {
    return await this.prisma.decision.update({
      where: { id: decisionId },
      data: {
        status,
        ...(policyResult ? { policyResult } : {}),
        ...(status === DecisionStatus.EXECUTED ? { executedAt: new Date() } : {}),
      },
    });
  }

  async saveRiskAssessment(decisionId: string, riskScore: number, riskLevel: any, factors: any[]) {
    return await this.prisma.riskAssessment.create({
      data: {
        decisionId,
        riskScore,
        riskLevel,
        factors: factors as Prisma.InputJsonValue,
      },
    });
  }

  async saveActionPlan(blueprint: ActionPlanBlueprint) {
    return await this.prisma.actionPlan.create({
      data: {
        decisionId: blueprint.decisionId,
        steps: blueprint.steps as unknown as Prisma.InputJsonValue,
        estimatedCost: blueprint.estimatedCost,
        estimatedDuration: blueprint.estimatedDuration,
        risk: blueprint.risk,
        rollbackPlan: (blueprint.rollbackPlan || []) as unknown as Prisma.InputJsonValue,
        approvalRequired: blueprint.approvalRequired as boolean,
        status: ActionStatus.PENDING,
      },
    });
  }

  async createAction(step: any, decisionId: string) {
    return await this.prisma.action.create({
      data: {
        decisionId,
        actionType: step.actionType,
        platform: step.platform || 'INTERNAL',
        accountId: step.accountId,
        entityType: step.entityType,
        entityId: step.entityId,
        payload: (step.payload || {}) as Prisma.InputJsonValue,
        status: ActionStatus.PENDING,
      },
    });
  }

  async updateActionStatus(actionId: string, status: ActionStatus, result?: any, error?: string) {
    return await this.prisma.action.update({
      where: { id: actionId },
      data: {
        status,
        ...(result ? { result: result as Prisma.InputJsonValue } : {}),
        ...(error ? { error } : {}),
        ...(status === ActionStatus.COMPLETED ? { executedAt: new Date() } : {}),
      },
    });
  }

  async createApprovalRequest(decisionId: string, actionId?: string, reason?: string) {
    return await this.prisma.approvalRequest.create({
      data: {
        decisionId,
        actionId,
        status: ApprovalStatus.PENDING,
        reason: reason || 'Approval required for medium/high risk decision.',
      },
    });
  }

  async resolveApprovalRequest(requestId: string, status: ApprovalStatus, reason?: string) {
    return await this.prisma.approvalRequest.update({
      where: { id: requestId },
      data: {
        status,
        reason,
        resolvedAt: new Date(),
      },
    });
  }

  async saveDecisionOutcome(decisionId: string, before: MetricSnapshot, after: MetricSnapshot) {
    const profitImpact = after.profit - before.profit;
    const revenueImpact = after.revenue - before.revenue;
    const commissionImpact = after.commission - before.commission;
    const roiImpact = after.roi - before.roi;
    const success = profitImpact >= 0;

    return await this.prisma.decisionOutcome.create({
      data: {
        decisionId,
        beforeMetrics: before as unknown as Prisma.InputJsonValue,
        afterMetrics: after as unknown as Prisma.InputJsonValue,
        delta: { profitImpact, revenueImpact, commissionImpact, roiImpact } as unknown as Prisma.InputJsonValue,
        profitImpact,
        revenueImpact,
        commissionImpact,
        roiImpact,
        success,
        confidence: success ? 0.9 : 0.2,
      },
    });
  }

  async logAudit(actor: string, action: string, entityType: string, entityId: string, details?: any) {
    return await this.prisma.auditLog.create({
      data: {
        actor,
        action,
        entityType,
        entityId,
        details: (details || {}) as Prisma.InputJsonValue,
      },
    });
  }

  async getHealth() {
    try {
      let health = await this.prisma.automationHealth.findFirst();
      if (!health) {
        health = await this.prisma.automationHealth.create({
          data: {
            healthScore: 100,
            apiStatus: 'HEALTHY',
            dbStatus: 'HEALTHY',
            circuitBreakerActive: false,
            globalKillSwitch: false,
          },
        });
      }
      return health;
    } catch {
      return {
        id: 'mock-health',
        healthScore: 100,
        apiStatus: 'HEALTHY',
        dbStatus: 'DISCONNECTED',
        circuitBreakerActive: false,
        globalKillSwitch: false,
        updatedAt: new Date(),
      };
    }
  }

  async updateHealth(healthScore: number, circuitBreakerActive: boolean, globalKillSwitch?: boolean) {
    try {
      const current = await this.getHealth();
      return await this.prisma.automationHealth.update({
        where: { id: current.id },
        data: {
          healthScore,
          circuitBreakerActive,
          ...(globalKillSwitch !== undefined ? { globalKillSwitch } : {}),
        },
      });
    } catch {
      return {
        id: 'mock-health',
        healthScore,
        circuitBreakerActive,
        globalKillSwitch: globalKillSwitch ?? false,
        updatedAt: new Date(),
      };
    }
  }

  async getBudget(scope = 'GLOBAL', scopeId = 'GLOBAL') {
    try {
      let budget = await this.prisma.budget.findFirst({
        where: { scope, scopeId },
      });
      if (!budget) {
        budget = await this.prisma.budget.create({
          data: {
            scope,
            scopeId,
            dailyBudget: 100,
            monthlyBudget: 3000,
            dailyLossLimit: 50,
            currentDailySpend: 0,
            currentMonthlySpend: 0,
            currency: 'USD',
          },
        });
      }
      return budget;
    } catch {
      return {
        id: 'mock-budget',
        scope,
        scopeId,
        dailyBudget: 100,
        monthlyBudget: 3000,
        dailyLossLimit: 50,
        currentDailySpend: 0,
        currentMonthlySpend: 0,
        currency: 'USD',
        updatedAt: new Date(),
      };
    }
  }

  async updateSpend(amount: number, scope = 'GLOBAL', scopeId = 'GLOBAL') {
    try {
      const budget = await this.getBudget(scope, scopeId);
      return await this.prisma.budget.update({
        where: { id: budget.id },
        data: {
          currentDailySpend: budget.currentDailySpend + amount,
          currentMonthlySpend: budget.currentMonthlySpend + amount,
        },
      });
    } catch {
      return {
        id: 'mock-budget',
        scope,
        scopeId,
        dailyBudget: 100,
        monthlyBudget: 3000,
        dailyLossLimit: 50,
        currentDailySpend: amount,
        currentMonthlySpend: amount,
        currency: 'USD',
        updatedAt: new Date(),
      };
    }
  }
}
