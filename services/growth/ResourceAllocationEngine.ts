export interface SystemResourceQuota {
  aiTokenLimitDaily: number;
  aiTokensUsed: number;
  publicationQuotaDaily: number;
  publicationsUsed: number;
  maxActiveCampaigns: number;
}

export interface ResourceAllocationDecision {
  allowAction: boolean;
  resourceAllocated: {
    aiTokens: number;
    publicationSlots: number;
  };
  reason?: string;
}

export class ResourceAllocationEngine {
  public allocateResources(
    quota: SystemResourceQuota,
    requiredTokens: number,
    requiredPublications: number
  ): ResourceAllocationDecision {
    const tokensAvailable = quota.aiTokenLimitDaily - quota.aiTokensUsed;
    const slotsAvailable = quota.publicationQuotaDaily - quota.publicationsUsed;

    if (tokensAvailable < requiredTokens) {
      return {
        allowAction: false,
        resourceAllocated: { aiTokens: 0, publicationSlots: 0 },
        reason: `Insufficient AI token quota (${tokensAvailable} available, ${requiredTokens} required)`
      };
    }

    if (slotsAvailable < requiredPublications) {
      return {
        allowAction: false,
        resourceAllocated: { aiTokens: 0, publicationSlots: 0 },
        reason: `Insufficient publication quota (${slotsAvailable} available, ${requiredPublications} required)`
      };
    }

    return {
      allowAction: true,
      resourceAllocated: {
        aiTokens: requiredTokens,
        publicationSlots: requiredPublications
      }
    };
  }
}
