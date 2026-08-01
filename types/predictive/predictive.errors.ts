/**
 * Error definitions for Module 9 - AI Learning & Predictive Intelligence Engine
 */

export class PredictiveError extends Error {
  constructor(message: string, public code: string = 'PREDICTIVE_ERROR', public statusCode: number = 500) {
    super(message);
    this.name = 'PredictiveError';
  }
}

export class PredictionModelError extends PredictiveError {
  constructor(message: string, public modelId?: string) {
    super(message, 'PREDICTION_MODEL_ERROR', 500);
    this.name = 'PredictionModelError';
  }
}

export class DataQualityError extends PredictiveError {
  constructor(message: string, public qualityScore?: number) {
    super(message, 'DATA_QUALITY_ERROR', 400);
    this.name = 'DataQualityError';
  }
}

export class DataLeakageError extends PredictiveError {
  constructor(message: string, public forbiddenFeatures?: string[]) {
    super(message, 'DATA_LEAKAGE_ERROR', 422);
    this.name = 'DataLeakageError';
  }
}

export class ModelDriftError extends PredictiveError {
  constructor(message: string, public driftMagnitude?: number) {
    super(message, 'MODEL_DRIFT_ERROR', 409);
    this.name = 'ModelDriftError';
  }
}

export class ColdStartError extends PredictiveError {
  constructor(message: string, public entityId?: string) {
    super(message, 'COLD_START_ERROR', 404);
    this.name = 'ColdStartError';
  }
}

export class FeatureStoreError extends PredictiveError {
  constructor(message: string, public featureName?: string) {
    super(message, 'FEATURE_STORE_ERROR', 400);
    this.name = 'FeatureStoreError';
  }
}

export class InsufficientDataError extends PredictiveError {
  constructor(message: string, public samplesFound: number = 0, public samplesRequired: number = 10) {
    super(message, 'INSUFFICIENT_DATA_ERROR', 400);
    this.name = 'InsufficientDataError';
  }
}
