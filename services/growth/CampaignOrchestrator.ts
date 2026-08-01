import { GrowthCampaignStatus } from '@prisma/client';
import { CampaignConfig } from '../../types/growth/campaign.types';

export interface CampaignStateTransition {
  campaignId: string;
  previousStatus: GrowthCampaignStatus;
  newStatus: GrowthCampaignStatus;
  timestamp: Date;
  reason: string;
}

export class CampaignOrchestrator {
  public validateTransition(
    currentStatus: GrowthCampaignStatus,
    targetStatus: GrowthCampaignStatus
  ): boolean {
    const validTransitions: Record<GrowthCampaignStatus, GrowthCampaignStatus[]> = {
      DRAFT: ['PLANNED', 'FAILED'],
      PLANNED: ['READY', 'DRAFT', 'FAILED'],
      READY: ['RUNNING', 'PAUSED', 'FAILED'],
      RUNNING: ['OPTIMIZING', 'SCALING', 'PAUSED', 'COMPLETED', 'FAILED', 'EXITED'],
      OPTIMIZING: ['RUNNING', 'SCALING', 'PAUSED', 'FAILED'],
      SCALING: ['RUNNING', 'OPTIMIZING', 'PAUSED', 'COMPLETED', 'EXITED'],
      PAUSED: ['RUNNING', 'READY', 'COMPLETED', 'EXITED'],
      COMPLETED: ['DRAFT', 'PLANNED'],
      FAILED: ['DRAFT', 'PLANNED'],
      EXITED: ['DRAFT']
    };

    return (validTransitions[currentStatus] || []).includes(targetStatus);
  }

  public transitionState(
    campaignId: string,
    currentStatus: GrowthCampaignStatus,
    targetStatus: GrowthCampaignStatus,
    reason: string
  ): CampaignStateTransition {
    if (!this.validateTransition(currentStatus, targetStatus)) {
      throw new Error(
        `Invalid campaign state transition from ${currentStatus} to ${targetStatus} for campaign ${campaignId}`
      );
    }

    return {
      campaignId,
      previousStatus: currentStatus,
      newStatus: targetStatus,
      timestamp: new Date(),
      reason
    };
  }
}
