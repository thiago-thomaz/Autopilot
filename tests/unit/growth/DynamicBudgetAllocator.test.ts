import { describe, it, expect } from 'vitest';
import { DynamicBudgetAllocator } from '../../../services/growth/DynamicBudgetAllocator';

describe('DynamicBudgetAllocator', () => {
  const allocator = new DynamicBudgetAllocator();

  it('reserves operational, experimental, and emergency funds before allocating', () => {
    const totalPool = 1000;
    const reserves = { operationalReserve: 10, experimentalReserve: 15, emergencyReserve: 5 }; // 30% total = 300
    const candidates = [
      { campaignId: 'c1', currentBudget: 100, marginalReturn: 1.5, priorityScore: 2, saturationLevel: 0.1 },
      { campaignId: 'c2', currentBudget: 100, marginalReturn: 1.2, priorityScore: 1, saturationLevel: 0.2 }
    ];

    const plan = allocator.calculateAllocations(totalPool, reserves, candidates);

    expect(plan.totalBudget).toBe(1000);
    expect(plan.reserves.operationalReserve).toBe(100);
    expect(plan.reserves.experimentalReserve).toBe(150);
    expect(plan.reserves.emergencyReserve).toBe(50);
    expect(plan.allocatedBudget + plan.unallocatedBudget).toBeLessThanOrEqual(700);
  });
});
