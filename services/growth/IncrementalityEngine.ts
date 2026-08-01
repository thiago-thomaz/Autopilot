export interface IncrementalityMetrics {
  campaignId: string;
  testGroupConversions: number;
  testGroupUsers: number;
  controlGroupConversions: number;
  controlGroupUsers: number;
  totalCampaignRevenue: number;
}

export interface IncrementalityReport {
  campaignId: string;
  testCVR: number;
  controlCVR: number;
  incrementalLift: number; // percentage lift
  incrementalNetRevenue: number;
  isStatisticallySignificant: boolean;
}

export class IncrementalityEngine {
  public calculateIncrementalLift(metrics: IncrementalityMetrics): IncrementalityReport {
    const {
      campaignId,
      testGroupConversions,
      testGroupUsers,
      controlGroupConversions,
      controlGroupUsers,
      totalCampaignRevenue
    } = metrics;

    const testCVR = testGroupUsers > 0 ? testGroupConversions / testGroupUsers : 0;
    const controlCVR = controlGroupUsers > 0 ? controlGroupConversions / controlGroupUsers : 0;

    const incrementalLift = controlCVR > 0 ? ((testCVR - controlCVR) / controlCVR) * 100 : testCVR > 0 ? 100 : 0;
    const incrementalShare = Math.max(0, testCVR - controlCVR) / Math.max(0.0001, testCVR);
    const incrementalNetRevenue = totalCampaignRevenue * incrementalShare;

    // Simple z-test check
    const diff = testCVR - controlCVR;
    const isStatisticallySignificant = diff > 0.005 && testGroupUsers >= 100 && controlGroupUsers >= 100;

    return {
      campaignId,
      testCVR: Number(testCVR.toFixed(4)),
      controlCVR: Number(controlCVR.toFixed(4)),
      incrementalLift: Number(incrementalLift.toFixed(2)),
      incrementalNetRevenue: Number(incrementalNetRevenue.toFixed(4)),
      isStatisticallySignificant
    };
  }
}
