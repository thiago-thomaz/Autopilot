import { PredictionResult } from '../../types/predictive/predictive.types';
import { FeatureVector } from '../../types/predictive/features.types';
import { BaselinePredictionModel } from './BaselinePredictionModel';

export class ConversionPredictionModel {
  private baselineModel: BaselinePredictionModel;

  constructor() {
    this.baselineModel = new BaselinePredictionModel();
  }

  public predictCVR(featureVector: FeatureVector, historicalCVRs?: number[]): PredictionResult {
    const result = this.baselineModel.predict(featureVector, historicalCVRs);
    result.predictionType = 'CVR';
    return result;
  }
}
