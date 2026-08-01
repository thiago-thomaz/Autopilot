import { describe, it, expect } from 'vitest';
import { AffiliateDisclosureLocalizationEngine } from '../../services/global/AffiliateDisclosureLocalizationEngine';
import { MarketPolicyEngine } from '../../services/global/MarketPolicyEngine';
import { MarketPolicyViolationError } from '../../types/global/global.errors';

describe('Affiliate Disclosure & Market Policy Tests', () => {
  const disclosureEngine = new AffiliateDisclosureLocalizationEngine();
  const policyEngine = new MarketPolicyEngine();

  it('should return country compliant disclosure strings (US FTC vs BR CONAR vs DE UWG)', () => {
    expect(disclosureEngine.getLocalizedDisclosure('US')).toContain('#ad');
    expect(disclosureEngine.getLocalizedDisclosure('DE')).toContain('#werbung');
    expect(disclosureEngine.getLocalizedDisclosure('BR')).toContain('#publi');
  });

  it('should block publication if affiliate disclosure is missing or GDPR opt-in is false in EU', () => {
    expect(() => policyEngine.validateMarketPolicy('DE', false, true)).toThrow(MarketPolicyViolationError);
    expect(() => policyEngine.validateMarketPolicy('DE', true, false)).toThrow(MarketPolicyViolationError);
    expect(policyEngine.validateMarketPolicy('US', true, false)).toBe(true);
  });
});
