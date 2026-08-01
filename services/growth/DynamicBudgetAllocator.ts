import { BudgetScope } from '@prisma/client';
import { GrowthBudgetSummary, BudgetReserveConfig } from '../../types/growth/growth.types';

export interface CampaignAllocationCandidate {
  campaignId: string;
  currentBudget: number;
  marginalReturn: number;
  priorityScore: number;
  saturationLevel: number;
}

export interface AllocationPlan {
  totalBudget: number;
  allocatedBudget: number;
  unallocatedBudget: number;
  reserves: BudgetReserveConfig;
  allocations: { campaignId: string; newBudget: number; delta: number }[];
}

export class DynamicBudgetAllocator {
  public calculateAllocations(
    totalAvailablePool: number,
    reservesConfig: BudgetReserveConfig,
    candidates: CampaignAllocationCandidate[]
  ): AllocationPlan {
    const operationalReserve = (totalAvailablePool * (reservesConfig.operationalReserve || 10)) / 100;
    const experimentalReserve = (totalAvailablePool * (reservesConfig.experimentalReserve || 15)) / 100;
    const emergencyReserve = (totalAvailablePool * (reservesConfig.emergencyReserve || 5)) / 100;

    const totalReserves = operationalReserve + experimentalReserve + emergencyReserve;
    const allocatablePool = Math.max(0, totalAvailablePool - totalReserves);

    if (candidates.length === 0 || allocatablePool <= 0) {
      return {
        totalBudget: totalAvailablePool,
        allocatedBudget: 0,
        unallocatedBudget: allocatablePool,
        reserves: { operationalReserve, experimentalReserve, emergencyReserve },
        allocations: []
      };
    }

    // Sort candidates by combined score: Marginal Return * Priority * (1 - Saturation)
    const scoredCandidates = candidates.map((c) => ({
      ...c,
      score: c.marginalReturn * c.priorityScore * (1 - Math.min(0.9, c.saturationLevel))
    })).sort((a, b) => b.score - a.score);

    const totalScore = scoredCandidates.reduce((acc, c) => acc + Math.max(0.1, c.score), 0);

    let sumAllocated = 0;
    const allocations = scoredCandidates.map((c) => {
      const share = Math.max(0.1, c.score) / totalScore;
      const rawAllocation = allocatablePool * share;
      // Cap individual campaign step to avoid massive spikes
      const cappedAllocation = Math.min(c.currentBudget * 1.5 || rawAllocation, rawAllocation);
      sumAllocated += cappedAllocation;
      return {
        campaignId: c.campaignId,
        newBudget: Number(cappedAllocation.toFixed(4)),
        delta: Number((cappedAllocation - c.currentBudget).toFixed(4))
      };
    });

    return {
      totalBudget: totalAvailablePool,
      allocatedBudget: Number(sumAllocated.toFixed(4)),
      unallocatedBudget: Number((allocatablePool - sumAllocated).toFixed(4)),
      reserves: { operationalReserve, experimentalReserve, emergencyReserve },
      allocations
    };
  }
}
