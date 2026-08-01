import { describe, it, expect } from 'vitest';
import { GlobalMarketEngine } from '../../services/global/GlobalMarketEngine';

describe('Module 10 - Global Market Expansion & Localization Engine (E2E Pipeline Test)', () => {
  const globalEngine = new GlobalMarketEngine();

  it('should execute end-to-end global expansion pipeline: product -> market evaluation -> Net Value -> full localization -> SEO tags', () => {
    const opp = globalEngine.evaluateGlobalMarketOpportunity(
      'prod-global-999',
      'SOFTWARE_SAAS',
      'DE',
      'de',
      'EUR',
      'BLOG',
      80.0,
      220.0
    );

    expect(opp.opportunityScore).toBeGreaterThan(70);
    expect(opp.netMarketValue).toBeGreaterThan(0);
    expect(opp.recommendation).toBe('EXPAND');

    const localizedPkg = globalEngine.localizePackage(
      'pkg-101',
      'SaaS Automation Tool',
      'Automate your business workflows effortlessly.',
      99.99,
      'USD',
      'en',
      'DE',
      'de',
      'EUR'
    );

    expect(localizedPkg.translatedTitle).toContain('DE');
    expect(localizedPkg.localizedCurrency).toBe('EUR');
    expect(localizedPkg.affiliateDisclosure).toContain('#werbung');
    expect(localizedPkg.status).toBe('READY_FOR_PUBLICATION');

    const seo = globalEngine.getSEOConfig('saas-automation', 'DE', 'de', localizedPkg.translatedTitle, localizedPkg.translatedBody);
    expect(seo.canonicalUrl).toContain('/de/saas-automation');
    expect(seo.hreflangTags.length).toBeGreaterThan(3);
  });
});
