import { ContentPackageType, ContentAngleType, ContentPackageStatus, ChannelPlatform } from '@prisma/client';

export interface VerifiedFact {
  type: 'VERIFIED_FACT' | 'SOURCE_DERIVED' | 'INFERENCE' | 'UNKNOWN';
  key: string;
  value: string | number | boolean;
  source: string;
}

export interface ClaimValidationResult {
  valid: boolean;
  unsupportedClaims: string[];
  warnings: string[];
}

export interface ScriptScene {
  sceneNumber: number;
  timeRange: string; // e.g. "0-5s"
  visualPrompt: string;
  narration: string;
  textOnScreen: string;
  soundCue?: string;
}

export interface VisualBrief {
  mainImageConcept: string;
  colorPalette: string[];
  compositionNotes: string;
  aspectRatio: string; // "9:16", "1:1", "16:9"
}

export interface LLMGenerationInput {
  productId: string;
  title: string;
  category?: string;
  brand?: string;
  currentPrice: number;
  previousPrice?: number;
  discountPercent?: number;
  url: string;
  rating?: number;
  reviewCount?: number;
  commissionRate?: number;
  estimatedCommission?: number;
  angle: ContentAngleType;
  channel: ChannelPlatform;
  contentType: ContentPackageType;
  verifiedFacts: VerifiedFact[];
  templateStyle?: string;
}

export interface GeneratedContentOutput {
  hook: string;
  title: string;
  subtitle?: string;
  shortDescription?: string;
  longDescription?: string;
  bullets?: string[];
  caption: string;
  cta: string;
  hashtags: string[];
  keywords: string[];
  script?: ScriptScene[];
  visualBrief?: VisualBrief;
  affiliateDisclosure: string;
  modelUsed: string;
  tokensUsed?: number;
  templateStyle?: string;
}
