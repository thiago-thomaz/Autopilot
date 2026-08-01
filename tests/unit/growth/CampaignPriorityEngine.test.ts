import { describe, it, expect } from 'vitest';
import { CampaignPriorityEngine } from '../../../services/growth/CampaignPriorityEngine';

describe('CampaignPriorityEngine', () => {
  const engine = new CampaignPriorityEngine();

  it('assigns P0 priority to high profit high ROI high confidence campaigns', () => {
    const scored = engine.calculatePriority({
      name: 'Test Campaign',
      strategy: 'HARVEST',
      budget: 1000,
      expectedProfit: 1200,
      expectedROI: 120,
      confidence: 0.9,
      risk: 0.1
    });

    expect(scored.assignedPriority).toBe('P0');
    expect(scored.score).toBeGreaterThanOrEqual(500);
  });
});
