export interface EarlyWarningAlert {
  alertType: 'CTR_DROP' | 'CVR_DROP' | 'EPC_DROP' | 'REFUND_SPIKE';
  entityId: string;
  severity: 'WARNING' | 'CRITICAL';
  previousValue: number;
  currentValue: number;
  message: string;
  timestamp: string;
}

export class EarlyWarningEngine {
  public checkEarlyWarnings(
    entityId: string,
    previousCVR: number,
    currentCVR: number,
    previousEPC: number,
    currentEPC: number,
    refundRate: number = 0.01
  ): EarlyWarningAlert[] {
    const alerts: EarlyWarningAlert[] = [];

    // Drop in CVR > 30%
    if (previousCVR > 0 && (previousCVR - currentCVR) / previousCVR > 0.30) {
      alerts.push({
        alertType: 'CVR_DROP',
        entityId,
        severity: 'CRITICAL',
        previousValue: previousCVR,
        currentValue: currentCVR,
        message: `Premature drop in Conversion Rate detected (${(previousCVR * 100).toFixed(1)}% -> ${(currentCVR * 100).toFixed(1)}%). Re-evaluation signal emitted to Module 8.`,
        timestamp: new Date().toISOString()
      });
    }

    // Drop in EPC > 25%
    if (previousEPC > 0 && (previousEPC - currentEPC) / previousEPC > 0.25) {
      alerts.push({
        alertType: 'EPC_DROP',
        entityId,
        severity: 'WARNING',
        previousValue: previousEPC,
        currentValue: currentEPC,
        message: `Earnings Per Click (EPC) degraded (${previousEPC.toFixed(2)} -> ${currentEPC.toFixed(2)}).`,
        timestamp: new Date().toISOString()
      });
    }

    // Refund Spike > 5%
    if (refundRate > 0.05) {
      alerts.push({
        alertType: 'REFUND_SPIKE',
        entityId,
        severity: 'CRITICAL',
        previousValue: 0.01,
        currentValue: refundRate,
        message: `High refund rate detected (${(refundRate * 100).toFixed(1)}%). Risk warning emitted.`,
        timestamp: new Date().toISOString()
      });
    }

    return alerts;
  }
}
