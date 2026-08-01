import {
  PlatformInfo,
  ConnectionTestResult,
  NormalizedProductInput,
  GeneratedAffiliateLink,
} from './types/affiliate.types';

export interface AffiliatePlatformAdapter {
  readonly platformSlug: string;

  getPlatformInfo(): PlatformInfo;

  validateConfiguration(credentials: Record<string, string>): boolean;

  testConnection(credentials: Record<string, string>): Promise<ConnectionTestResult>;

  searchProducts(query: string, credentials: Record<string, string>): Promise<NormalizedProductInput[]>;

  getProduct(externalId: string, credentials: Record<string, string>): Promise<NormalizedProductInput | null>;

  generateAffiliateLink(rawUrl: string, credentials: Record<string, string>): Promise<GeneratedAffiliateLink>;

  getMetrics(startDate: string, endDate: string, credentials: Record<string, string>): Promise<Record<string, unknown>>;

  getCommissions(startDate: string, endDate: string, credentials: Record<string, string>): Promise<Record<string, unknown>>;
}
