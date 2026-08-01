import { PolicyResult, PolicyCheckResult } from '../../types/automation/automation.types';
import { PolicyViolationError } from '../../types/automation/automation.errors';

export class PolicyEngine {
  private platformPolicies: Map<string, { maxPostsPerDay: number; optInRequired: boolean }> = new Map([
    ['INSTAGRAM', { maxPostsPerDay: 5, optInRequired: false }],
    ['TIKTOK', { maxPostsPerDay: 6, optInRequired: false }],
    ['WHATSAPP', { maxPostsPerDay: 3, optInRequired: true }],
    ['EMAIL', { maxPostsPerDay: 2, optInRequired: true }],
    ['TELEGRAM', { maxPostsPerDay: 10, optInRequired: true }],
    ['PINTEREST', { maxPostsPerDay: 15, optInRequired: false }],
  ]);

  validatePolicy(params: {
    platform?: string;
    actionType: string;
    hasOptIn?: boolean;
    frequencyCount?: number;
    country?: string;
    isAiGeneratedRecommendation?: boolean;
  }): PolicyCheckResult {
    const { platform = 'GLOBAL', actionType, hasOptIn = true, frequencyCount = 0, isAiGeneratedRecommendation = false } = params;
    const violations: string[] = [];

    // Check opt-in requirements for messaging channels
    const platformPolicy = this.platformPolicies.get(platform);
    if (platformPolicy) {
      if (platformPolicy.optInRequired && !hasOptIn) {
        violations.push(`Opt-in missing for communication platform ${platform}`);
      }
      if (frequencyCount >= platformPolicy.maxPostsPerDay) {
        violations.push(`Frequency limit reached for ${platform} (${frequencyCount}/${platformPolicy.maxPostsPerDay} actions today)`);
      }
    }

    // Check prohibited action types or AI rule violations
    if (isAiGeneratedRecommendation && violations.length > 0) {
      // AI recommendations violating policies are DENIED immediately
      return {
        policyCode: 'AI_POLICY_OVERRIDE',
        allowed: false,
        result: PolicyResult.DENY,
        violations: [`AI recommendation rejected due to compliance violations: ${violations.join('; ')}`],
      };
    }

    if (violations.length > 0) {
      return {
        policyCode: 'PLATFORM_POLICY_CHECK',
        allowed: false,
        result: PolicyResult.DENY,
        violations,
      };
    }

    // Medium/High risk actions require human review under default policies
    if (['CHANGE_COUNTRY', 'SCALE_WINNER', 'CHANGE_PRODUCT'].includes(actionType)) {
      return {
        policyCode: 'HIGH_IMPACT_POLICY_CHECK',
        allowed: true,
        result: PolicyResult.REVIEW_REQUIRED,
        violations: [],
      };
    }

    return {
      policyCode: 'STANDARD_POLICY_CHECK',
      allowed: true,
      result: PolicyResult.ALLOW,
      violations: [],
    };
  }

  assertPolicy(params: Parameters<PolicyEngine['validatePolicy']>[0]): PolicyCheckResult {
    const result = this.validatePolicy(params);
    if (result.result === PolicyResult.DENY) {
      throw new PolicyViolationError(`Policy violation: ${result.violations.join(', ')}`, result);
    }
    return result;
  }
}
