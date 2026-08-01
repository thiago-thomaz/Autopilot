export interface StrategicResourcePlan {
  period: string;
  totalCapitalPool: number;
  allocations: {
    marketing: number;
    aiAndTools: number;
    contentProduction: number;
    localization: number;
    reserve: number;
  };
}

export class ResourcePlanningEngine {
  public planResources(totalCapitalPool: number, growthMode: string = 'BALANCED'): StrategicResourcePlan {
    let marketingShare = 0.45;
    let aiShare = 0.20;
    let contentShare = 0.15;
    let locShare = 0.10;
    let reserveShare = 0.10;

    if (growthMode === 'AGGRESSIVE') {
      marketingShare = 0.55;
      aiShare = 0.20;
      contentShare = 0.15;
      locShare = 0.05;
      reserveShare = 0.05;
    } else if (growthMode === 'CONSERVATIVE') {
      marketingShare = 0.30;
      aiShare = 0.15;
      contentShare = 0.15;
      locShare = 0.10;
      reserveShare = 0.30;
    }

    return {
      period: 'QUARTERLY',
      totalCapitalPool,
      allocations: {
        marketing: Number((totalCapitalPool * marketingShare).toFixed(4)),
        aiAndTools: Number((totalCapitalPool * aiShare).toFixed(4)),
        contentProduction: Number((totalCapitalPool * contentShare).toFixed(4)),
        localization: Number((totalCapitalPool * locShare).toFixed(4)),
        reserve: Number((totalCapitalPool * reserveShare).toFixed(4))
      }
    };
  }
}
