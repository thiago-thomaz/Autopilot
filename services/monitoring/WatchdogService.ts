import { PrismaClient } from '@prisma/client';
import { Logger } from '../../lib/logger';
import { SystemConfigService } from '../core/SystemConfigService';

const prisma = new PrismaClient();

export enum WatchdogState {
  HEALTHY = 'HEALTHY',
  WARNING = 'WARNING',
  DEGRADED = 'DEGRADED',
  CRITICAL = 'CRITICAL'
}

export interface WatchdogReport {
  state: WatchdogState;
  timestamp: Date;
  details: {
    lastDiscoveryRun?: Date | null;
    lastPublishedItem?: Date | null;
    discoveryWorking: boolean;
    queueBlocked: boolean;
    channelErrors: string[];
    noOpportunities: boolean;
  };
}

export class WatchdogService {
  /**
   * Evaluates the overall health of the Affiliate Autopilot system.
   */
  static async evaluateHealth(): Promise<WatchdogReport> {
    const isGlobalEnabled = await SystemConfigService.isGlobalAutopilotEnabled();
    if (!isGlobalEnabled) {
      return this.buildReport(WatchdogState.WARNING, {
        discoveryWorking: false,
        queueBlocked: true,
        channelErrors: ['GLOBAL_KILL_SWITCH_ACTIVE'],
        noOpportunities: false
      });
    }

    // 1. Check Discovery Health
    const lastProduct = await prisma.product.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true }
    });
    
    // If no product was discovered in the last 6 hours, maybe discovery is failing
    const hoursSinceLastDiscovery = lastProduct 
      ? (new Date().getTime() - lastProduct.createdAt.getTime()) / (1000 * 60 * 60)
      : Infinity;
    
    const discoveryWorking = hoursSinceLastDiscovery < 6;

    // 2. Check Queue Health
    const pendingQueue = await prisma.contentQueue.count({
      where: { status: 'PENDING' }
    });
    const failedQueue = await prisma.contentQueue.count({
      where: { status: 'FAILED' }
    });

    const queueBlocked = failedQueue > 10 && pendingQueue > 50;

    // 3. Check Channel Health (Telegram etc)
    const recentFailedPublications = await prisma.publicationRecord.findMany({
      where: {
        status: 'FAILED',
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } // Last hour
      },
      select: { channel: true, status: true }
    });
    
    const channelErrors = [...new Set(recentFailedPublications.map(p => p.channel.toString()))];

    // 4. Distinguish NO_OPPORTUNITY from SYSTEM_FAILURE
    // If discovery is working, but there are no approved opportunities in the last 24h
    const recentApproved = await prisma.product.count({
      where: {
        status: 'APPROVED',
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }
    });

    const noOpportunities = discoveryWorking && recentApproved === 0;

    const lastPublication = await prisma.publicationRecord.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true }
    });

    let state = WatchdogState.HEALTHY;
    
    if (!discoveryWorking) state = WatchdogState.WARNING;
    if (channelErrors.length > 0) state = WatchdogState.DEGRADED;
    if (queueBlocked) state = WatchdogState.CRITICAL;

    // NO_OPPORTUNITY is not a critical error if discovery is actually inserting new items.
    if (noOpportunities && state !== WatchdogState.CRITICAL) {
      state = WatchdogState.HEALTHY;
    }

    const report = this.buildReport(state, {
      lastDiscoveryRun: lastProduct?.createdAt || null,
      lastPublishedItem: lastPublication?.createdAt || null,
      discoveryWorking,
      queueBlocked,
      channelErrors,
      noOpportunities
    });

    this.logReport(report);
    
    return report;
  }

  private static buildReport(state: WatchdogState, details: any): WatchdogReport {
    return {
      state,
      timestamp: new Date(),
      details
    };
  }

  private static logReport(report: WatchdogReport) {
    if (report.state === WatchdogState.CRITICAL || report.state === WatchdogState.DEGRADED) {
      Logger.error('WATCHDOG', `System state is ${report.state}`, JSON.stringify(report.details));
      // In a real scenario, this would send an alert to a private Admin Telegram group
    } else {
      Logger.info('WATCHDOG', `System state is ${report.state}`, JSON.stringify(report.details));
    }
  }
}
