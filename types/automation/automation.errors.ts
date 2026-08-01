export class AutomationError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'AutomationError';
  }
}

export class InsufficientDataError extends AutomationError {
  constructor(message = 'Sample size insufficient to make autonomous decision', details?: any) {
    super(message, 'INSUFFICIENT_DATA', details);
    this.name = 'InsufficientDataError';
  }
}

export class BudgetExceededError extends AutomationError {
  constructor(message = 'Action cost exceeds maximum daily spend or loss limits', details?: any) {
    super(message, 'BUDGET_EXCEEDED', details);
    this.name = 'BudgetExceededError';
  }
}

export class PolicyViolationError extends AutomationError {
  constructor(message = 'Decision violates compliance policies or platform rules', details?: any) {
    super(message, 'POLICY_VIOLATION', details);
    this.name = 'PolicyViolationError';
  }
}

export class HighRiskBlockedError extends AutomationError {
  constructor(message = 'High-risk action blocked due to current autonomy level constraints', details?: any) {
    super(message, 'HIGH_RISK_BLOCKED', details);
    this.name = 'HighRiskBlockedError';
  }
}

export class CircuitBreakerOpenError extends AutomationError {
  constructor(message = 'Automation Circuit Breaker is OPEN due to elevated error rates', details?: any) {
    super(message, 'CIRCUIT_BREAKER_OPEN', details);
    this.name = 'CircuitBreakerOpenError';
  }
}

export class KillSwitchActiveError extends AutomationError {
  constructor(message = 'Kill Switch is active for this scope or platform', details?: any) {
    super(message, 'KILL_SWITCH_ACTIVE', details);
    this.name = 'KillSwitchActiveError';
  }
}
