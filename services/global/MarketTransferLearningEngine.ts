import { MarketSimilarityEngine } from './MarketSimilarityEngine';

export class MarketTransferLearningEngine {
  private similarityEngine: MarketSimilarityEngine;

  constructor() {
    this.similarityEngine = new MarketSimilarityEngine();
  }

  public transferHistoricalCVR(originCVR: number, originCountry: string, targetCountry: string): number {
    const sim = this.similarityEngine.calculateMarketSimilarity(originCountry, targetCountry);
    const transferredCVR = originCVR * sim;
    return Number(transferredCVR.toFixed(4));
  }
}
