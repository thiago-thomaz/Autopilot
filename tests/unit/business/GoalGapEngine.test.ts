import { describe, it, expect } from 'vitest';
import { GoalGapEngine } from '../../../services/business/GoalGapEngine';

describe('GoalGapEngine', () => {
  const engine = new GoalGapEngine();

  it('calculates required daily run rate to reach target value by deadline', () => {
    const deadline = new Date(Date.now() + 10 * 86400000); // 10 days remaining
    const analysis = engine.calculateGoalGap(
      {
        name: 'Monthly Net Profit Goal',
        type: 'NET_PROFIT',
        period: 'MONTHLY',
        targetValue: 10000,
        currentValue: 4000,
        deadline
      },
      700 // current daily run rate
    );

    // Gap = 10000 - 4000 = 6000
    // Required Daily = 6000 / 10 = 600
    // On track: 700 >= 600 -> true
    expect(analysis.gap).toBe(6000);
    expect(analysis.daysRemaining).toBe(10);
    expect(analysis.requiredDailyRunRate).toBe(600);
    expect(analysis.onTrack).toBe(true);
  });
});
