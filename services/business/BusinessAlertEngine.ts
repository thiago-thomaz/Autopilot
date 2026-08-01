export interface BusinessAlert {
  id: string;
  severity: 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
  type: string;
  message: string;
  timestamp: Date;
}

export class BusinessAlertEngine {
  private alerts: BusinessAlert[] = [];

  public dispatchAlert(type: string, message: string, severity: BusinessAlert['severity'] = 'WARNING'): BusinessAlert {
    const alert: BusinessAlert = {
      id: `balert_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type,
      message,
      severity,
      timestamp: new Date()
    };
    this.alerts.push(alert);
    return alert;
  }

  public getActiveAlerts(): BusinessAlert[] {
    return [...this.alerts];
  }
}
