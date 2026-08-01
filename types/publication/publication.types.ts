import { OmnichannelChannel, OmnichannelPublicationStatus, PublicationAccountStatus } from '@prisma/client';

export interface PublicationPayload {
  title: string;
  body: string;
  mediaUrls?: string[];
  trackingUrl: string;
  affiliateDisclosure: string;
  hashtags?: string[];
  cta: string;
  extraData?: Record<string, any>;
}

export interface PublicationResult {
  success: boolean;
  externalPublicationId?: string;
  externalUrl?: string;
  status: OmnichannelPublicationStatus;
  errorMessage?: string;
  publicationType?: 'AUTOMATIC' | 'MANUAL';
  manualPackage?: {
    platform: string;
    whyManualReason: string;
    formattedText: string;
    mediaUrls: string[];
    trackingUrl: string;
    instructions: string;
  };
}

export interface PublicationPlanRequest {
  contentPackageId: string;
  channels?: OmnichannelChannel[];
  targetCountries?: string[];
  targetLanguages?: string[];
  campaignId?: string;
  scheduledAt?: Date;
}

export interface PublicationPlanResult {
  planId: string;
  totalPublications: number;
  channelsPlanned: OmnichannelChannel[];
  countriesPlanned: string[];
  publications: Array<{
    id: string;
    channel: OmnichannelChannel;
    country: string;
    language: string;
    status: OmnichannelPublicationStatus;
    scheduledAt: Date;
  }>;
}

export interface AccountHealth {
  accountId: string;
  platform: string;
  status: PublicationAccountStatus;
  rateLimitRemaining: number;
  lastTestedAt?: Date;
}
