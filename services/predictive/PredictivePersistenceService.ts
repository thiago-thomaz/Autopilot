import { PrismaClient } from '@prisma/client';
import { PredictionResult } from '../../types/predictive/predictive.types';

export class PredictivePersistenceService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async savePrediction(prediction: PredictionResult): Promise<string> {
    try {
      const record = await this.prisma.prediction.create({
        data: {
          predictionType: prediction.predictionType as any,
          entityType: prediction.entityType,
          entityId: prediction.entityId,
          predictedValue: prediction.predictedValue,
          lowerBound: prediction.lowerBound,
          upperBound: prediction.upperBound,
          confidenceScore: prediction.confidenceScore,
          riskScore: prediction.riskScore,
          modelVersion: prediction.modelVersion,
          timestamp: new Date(prediction.timestamp)
        }
      });
      return record.id;
    } catch {
      // In non-connected fallback environment, return mock UUID
      return `pred-mock-${Date.now()}`;
    }
  }

  public async logAIUsage(provider: string, model: string, inputTokens: number, outputTokens: number, estimatedCost: number): Promise<void> {
    try {
      await this.prisma.aIUsageRecord.create({
        data: {
          provider,
          model,
          inputTokens,
          outputTokens,
          requests: 1,
          estimatedCost
        }
      });
    } catch {
      // Ignore database write failures in offline mode
    }
  }
}
