import { CampaignStrategy } from '@prisma/client';

export interface PortfolioTargetAllocation {
  harvestShare: number; // e.g. 50%
  expansionShare: number; // e.g. 25%
  explorationShare: number; // e.g. 15%
  defenseShare: number; // e.g. 10%
}

export class StrategicGrowthEngine {
  public determinePortfolioStrategy(
    marketMaturity: 'EMERGING' | 'GROWTH' | 'MATURE',
    riskTolerance: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE'
  ): PortfolioTargetAllocation {
    if (riskTolerance === 'CONSERVATIVE') {
      return { harvestShare: 70, expansionShare: 15, explorationShare: 5, defenseShare: 10 };
    }
    if (riskTolerance === 'AGGRESSIVE') {
      return { harvestShare: 35, expansionShare: 40, explorationShare: 20, defenseShare: 5 };
    }
    // BALANCED
    return { harvestShare: 50, expansionShare: 25, explorationShare: 15, defenseShare: 10 };
  }
}
