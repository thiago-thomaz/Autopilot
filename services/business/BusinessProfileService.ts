import { BusinessProfileConfig } from '../../types/business/business.types';

export class BusinessProfileService {
  private profile: BusinessProfileConfig = {
    name: 'Affiliate Autopilot Global Business',
    description: 'International autonomous affiliate marketing operation',
    baseCurrency: 'USD',
    baseCountry: 'US',
    businessModel: 'AFFILIATE',
    riskTolerance: 'MEDIUM',
    growthMode: 'BALANCED'
  };

  public getProfile(): BusinessProfileConfig {
    return { ...this.profile };
  }

  public updateProfile(updated: Partial<BusinessProfileConfig>): BusinessProfileConfig {
    this.profile = { ...this.profile, ...updated };
    return this.profile;
  }
}
