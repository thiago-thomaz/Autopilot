import { MarketPolicyViolationError } from '../../types/global/global.errors';

export class MarketPolicyEngine {
  public validateMarketPolicy(country: string, hasAffiliateDisclosure: boolean, isMessagingOptIn: boolean = true): boolean {
    const code = country.toUpperCase();

    // EU GDPR & UK Data Protection Act: Mandatory opt-in for messaging
    if (['DE', 'FR', 'ES', 'IT', 'UK', 'NL'].includes(code) && !isMessagingOptIn) {
      throw new MarketPolicyViolationError(`GDPR violation: Messaging consent opt-in required for ${country}`, country, 'GDPR_OPTIN_REQUIRED');
    }

    // US FTC & UK ASA & BR CONAR: Mandatory disclosure
    if (!hasAffiliateDisclosure) {
      throw new MarketPolicyViolationError(`Regulatory violation: Mandatory affiliate disclosure missing for ${country}`, country, 'DISCLOSURE_REQUIRED');
    }

    return true;
  }
}
