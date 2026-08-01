export interface BackupChannelRoute {
  primaryChannel: string;
  backupChannel: string;
  isTriggered: boolean;
  reason?: string;
}

export class BusinessContinuityEngine {
  private fallbackRoutes: BackupChannelRoute[] = [
    { primaryChannel: 'INSTAGRAM', backupChannel: 'TELEGRAM', isTriggered: false },
    { primaryChannel: 'TIKTOK', backupChannel: 'YOUTUBE_SHORTS', isTriggered: false }
  ];

  public triggerFallback(primaryChannel: string, reason: string): BackupChannelRoute | null {
    const route = this.fallbackRoutes.find((r) => r.primaryChannel.toUpperCase() === primaryChannel.toUpperCase());
    if (route) {
      route.isTriggered = true;
      route.reason = reason;
      return route;
    }
    return null;
  }
}
