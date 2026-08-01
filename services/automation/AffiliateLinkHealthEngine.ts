import { DecisionPayload, DecisionType } from '../../types/automation/automation.types';

export class AffiliateLinkHealthEngine {
  checkLinkStatus(productId: string, httpStatusCode: number): DecisionPayload | null {
    if (httpStatusCode === 404 || httpStatusCode >= 500) {
      return {
        scope: 'PRODUCT',
        entityType: 'Product',
        entityId: productId,
        decisionType: DecisionType.PAUSE,
        reason: `Broken affiliate link detected (HTTP status ${httpStatusCode}). Pausing campaign to protect ROI.`,
        confidence: 0.99,
        riskScore: 10,
        priority: 0,
      };
    }
    return null;
  }
}
