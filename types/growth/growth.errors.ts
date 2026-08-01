export class GrowthError extends Error {
  constructor(message: string, public code: string = 'GROWTH_ERROR', public details?: any) {
    super(message);
    this.name = 'GrowthError';
  }
}

export class BudgetExceededError extends GrowthError {
  constructor(requested: number, available: number, scope: string) {
    super(
      `Requested budget (${requested}) exceeds available allocation (${available}) for scope ${scope}`,
      'BUDGET_EXCEEDED',
      { requested, available, scope }
    );
    this.name = 'BudgetExceededError';
  }
}

export class GuardrailViolationError extends GrowthError {
  constructor(reason: string, details?: any) {
    super(`Autonomy Guardrail Violation: ${reason}`, 'GUARDRAIL_VIOLATION', details);
    this.name = 'GuardrailViolationError';
  }
}

export class KillSwitchActiveError extends GrowthError {
  constructor(scope: string = 'GLOBAL') {
    super(`Operation blocked because ${scope} Kill Switch is ACTIVE`, 'KILL_SWITCH_ACTIVE', { scope });
    this.name = 'KillSwitchActiveError';
  }
}

export class ExperimentValidationError extends GrowthError {
  constructor(message: string) {
    super(message, 'EXPERIMENT_VALIDATION_ERROR');
    this.name = 'ExperimentValidationError';
  }
}

export class CampaignNotFoundError extends GrowthError {
  constructor(campaignId: string) {
    super(`Campaign not found: ${campaignId}`, 'CAMPAIGN_NOT_FOUND', { campaignId });
    this.name = 'CampaignNotFoundError';
  }
}
