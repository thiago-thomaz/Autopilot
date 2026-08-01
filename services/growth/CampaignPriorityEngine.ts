import { CampaignConfig } from '../../types/growth/campaign.types';

export interface ScoredCampaign extends CampaignConfig {
  score: number;
  assignedPriority: 'P0' | 'P1' | 'P2' | 'P3';
}

export class CampaignPriorityEngine {
  public calculatePriority(campaign: CampaignConfig): ScoredCampaign {
    const expectedProfit = campaign.expectedProfit || 0;
    const expectedROI = campaign.expectedROI || 0;
    const confidence = campaign.confidence || 0.8;
    const risk = campaign.risk || 0.2;

    // Score formula = (Expected Profit * 0.4) + (Expected ROI * 0.3) + (Confidence * 200) - (Risk * 100)
    const rawScore = expectedProfit * 0.4 + expectedROI * 0.3 + confidence * 200 - risk * 100;
    const score = Number(Math.max(0, rawScore).toFixed(4));

    let assignedPriority: 'P0' | 'P1' | 'P2' | 'P3' = 'P2';
    if (score >= 500) {
      assignedPriority = 'P0';
    } else if (score >= 250) {
      assignedPriority = 'P1';
    } else if (score >= 100) {
      assignedPriority = 'P2';
    } else {
      assignedPriority = 'P3';
    }

    return {
      ...campaign,
      score,
      assignedPriority
    };
  }

  public rankCampaigns(campaigns: CampaignConfig[]): ScoredCampaign[] {
    return campaigns
      .map((c) => this.calculatePriority(c))
      .sort((a, b) => b.score - a.score);
  }
}
