import { FeatureEngineeringEngine } from './FeatureEngineeringEngine';
import { DataQualityEngine } from './DataQualityEngine';
import { ColdStartEngine } from './ColdStartEngine';
import { ProductSimilarityEngine } from './ProductSimilarityEngine';
import { ConversionPredictionModel } from './ConversionPredictionModel';
import { ProfitPredictionModel } from './ProfitPredictionModel';
import { ROIPredictionModel } from './ROIPredictionModel';
import { EPCPredictionModel } from './EPCPredictionModel';
import { PredictiveOpportunityEngine } from './PredictiveOpportunityEngine';
import { ModelRegistry } from './ModelRegistry';
import { RecommendationEngine } from './RecommendationEngine';
import { PredictiveOpportunity, PredictionResult, RecommendationItem } from '../../types/predictive/predictive.types';

export class PredictionService {
  private featureEngine: FeatureEngineeringEngine;
  private qualityEngine: DataQualityEngine;
  private coldStartEngine: ColdStartEngine;
  private similarityEngine: ProductSimilarityEngine;
  private conversionModel: ConversionPredictionModel;
  private profitModel: ProfitPredictionModel;
  private roiModel: ROIPredictionModel;
  private epcModel: EPCPredictionModel;
  private opportunityEngine: PredictiveOpportunityEngine;
  private registry: ModelRegistry;
  private recommendationEngine: RecommendationEngine;

  constructor() {
    this.featureEngine = new FeatureEngineeringEngine();
    this.qualityEngine = new DataQualityEngine();
    this.coldStartEngine = new ColdStartEngine();
    this.similarityEngine = new ProductSimilarityEngine();
    this.conversionModel = new ConversionPredictionModel();
    this.profitModel = new ProfitPredictionModel();
    this.roiModel = new ROIPredictionModel();
    this.epcModel = new EPCPredictionModel();
    this.opportunityEngine = new PredictiveOpportunityEngine();
    this.registry = new ModelRegistry();
    this.recommendationEngine = new RecommendationEngine();
  }

  /**
   * Main entry point for predicting comprehensive metrics for a product or entity
   */
  public async predictEntityOpportunity(rawData: Record<string, unknown>): Promise<{
    cvrPrediction: PredictionResult;
    profitPrediction: PredictionResult;
    roiPrediction: PredictionResult;
    epcPrediction: PredictionResult;
    opportunity: PredictiveOpportunity;
  }> {
    const quality = this.qualityEngine.evaluateQuality(rawData);
    const featureVector = this.featureEngine.extractFeatures(rawData);

    // If sample count is insufficient, trigger Cold Start Engine
    const isColdStart = (rawData['sampleCount'] as number ?? 0) < 5;
    const cvrPrediction = isColdStart
      ? this.coldStartEngine.generateColdStartPrediction(
          featureVector.entityId,
          featureVector.entityType,
          rawData['category'] as string,
          Number(rawData['price'] ?? 0)
        )
      : this.conversionModel.predictCVR(featureVector);

    const price = Number(rawData['price'] ?? 100);
    const commissionRate = Number(rawData['commissionRate'] ?? 0.05);
    const clicks = Number(rawData['clicks'] ?? 100);
    const cost = Number(rawData['cost'] ?? 10);

    const cvr = cvrPrediction.predictedValue;
    const expectedRevenue = clicks * cvr * (price * commissionRate);

    const profitPrediction = this.profitModel.predictProfit(featureVector, expectedRevenue, cost);
    const roiPrediction = this.roiModel.predictROI(featureVector, profitPrediction.predictedValue, cost);
    const epcPrediction = this.epcModel.predictEPC(featureVector, cvr);

    const title = (rawData['title'] as string) || `Product ${featureVector.entityId}`;
    const category = (rawData['category'] as string) || 'GENERAL';
    const country = (rawData['country'] as string) || 'US';

    const opportunity = this.opportunityEngine.calculateOpportunityScore(
      featureVector,
      title,
      category,
      country,
      profitPrediction.predictedValue,
      roiPrediction.predictedValue,
      cvr,
      epcPrediction.predictedValue,
      cvrPrediction.confidenceScore
    );

    return {
      cvrPrediction,
      profitPrediction,
      roiPrediction,
      epcPrediction,
      opportunity
    };
  }

  public getModelRegistry(): ModelRegistry {
    return this.registry;
  }

  public generateRecommendations(opportunities: PredictiveOpportunity[]): RecommendationItem[] {
    return this.recommendationEngine.generateRecommendations(opportunities);
  }

  public async predictOpportunityScore(productIdOrData: string | Record<string, unknown>): Promise<{
    opportunityScore: number;
    expectedMetrics: { epc: number; cvr: number; profit: number; roi: number };
    confidence: number;
  }> {
    const rawData = typeof productIdOrData === 'string' ? { entityId: productIdOrData } : productIdOrData;
    const res = await this.predictEntityOpportunity(rawData);
    return {
      opportunityScore: res.opportunity.opportunityScore,
      expectedMetrics: {
        epc: res.epcPrediction.predictedValue,
        cvr: res.cvrPrediction.predictedValue,
        profit: res.profitPrediction.predictedValue,
        roi: res.roiPrediction.predictedValue
      },
      confidence: res.cvrPrediction.confidenceScore
    };
  }
}
