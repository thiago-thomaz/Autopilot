export type AffiliateAccountStatus =
  | 'PENDING_CONFIGURATION'
  | 'CONFIGURED'
  | 'CONNECTED'
  | 'CONNECTION_ERROR'
  | 'DISABLED'
  | 'MANUAL_REQUIRED'
  | 'NOT_AVAILABLE';

export type AffiliateEnvironment = 'DEVELOPMENT' | 'PRODUCTION';

export interface AffiliatePlatformCapabilities {
  apiAvailable: boolean;
  linkGenerationAvailable: boolean;
  productDiscoveryAvailable: boolean;
  metricsAvailable: boolean;
  commissionReportingAvailable: boolean;
  manualLinkGenerationOnly?: boolean;
}

export interface PlatformInfo {
  id: string;
  name: string;
  slug: string;
  website?: string;
  documentationUrl?: string;
  capabilities: AffiliatePlatformCapabilities;
}

export interface ConnectionTestResult {
  success: boolean;
  status: AffiliateAccountStatus;
  message: string;
  testedAt: string;
  details?: Record<string, unknown>;
}

export interface NormalizedProductInput {
  externalId: string;
  affiliatePlatformId: string;
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  category?: string;
  brand?: string;
  currentPrice: number;
  previousPrice?: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
  availability: boolean;
  commissionRate?: number;
  estimatedCommission?: number;
  opportunityScore?: number;
}

export interface GeneratedAffiliateLink {
  rawUrl: string;
  affiliateUrl: string;
  manualActionRequired: boolean;
  instructions?: string;
}

export interface RateLimitConfig {
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
  cooldownMs: number;
  timeoutMs: number;
}
