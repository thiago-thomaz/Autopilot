/**
 * Feature Store and Feature Engineering Types for Module 9
 */

export interface FeatureDefinition {
  name: string;
  dataType: 'NUMBER' | 'STRING' | 'BOOLEAN' | 'ARRAY';
  description: string;
  source: 'CLICK' | 'CONVERSION' | 'PRODUCT' | 'COMMISSION' | 'CHANNEL' | 'COMPUTED';
  isPostConversion: boolean; // Flag to enforce anti-data leakage rules
}

export interface FeatureVector {
  entityId: string;
  entityType: 'PRODUCT' | 'OFFER' | 'CONTENT' | 'CHANNEL' | 'COUNTRY';
  timestamp: string;
  features: Record<string, number | string | boolean>;
  freshnessScore: number; // 0.0 to 1.0
}

export interface FeatureTransformation {
  featureName: string;
  method: 'LOG_TRANSFORM' | 'MIN_MAX_SCALE' | 'Z_SCORE' | 'ONE_HOT_ENCODE' | 'MOVING_AVERAGE';
  params?: Record<string, number | string>;
}

export interface TrainingDatasetSplit {
  trainFeatures: FeatureVector[];
  trainTargets: number[];
  validationFeatures: FeatureVector[];
  validationTargets: number[];
  testFeatures: FeatureVector[];
  testTargets: number[];
  splitRatio: { train: number; validation: number; test: number };
  temporalBoundaries: { trainEnd: string; valEnd: string };
}
