import { CircuitBreakerOpenError, KillSwitchActiveError } from '../../types/automation/automation.errors';
import { AutomationPersistenceService } from './AutomationPersistenceService';

export class AutomationCircuitBreaker {
  private failureThreshold: number; // e.g. 5 consecutive failures or 30% error rate
  private failureCount = 0;
  private isCircuitOpen = false;
  private channelKillSwitches: Map<string, boolean> = new Map();
  private campaignKillSwitches: Map<string, boolean> = new Map();
  private globalKillSwitch = false;
  private persistence: AutomationPersistenceService;

  constructor(options?: { failureThreshold?: number; persistence?: AutomationPersistenceService }) {
    this.failureThreshold = options?.failureThreshold ?? 5;
    this.persistence = options?.persistence || new AutomationPersistenceService();
  }

  async checkState(channel?: string, campaignId?: string) {
    const health = await this.persistence.getHealth();

    if (health.globalKillSwitch || this.globalKillSwitch) {
      throw new KillSwitchActiveError('Global Kill Switch is ACTIVE. All autonomous operations are halted.');
    }

    if (health.circuitBreakerActive || this.isCircuitOpen) {
      throw new CircuitBreakerOpenError('Automation Circuit Breaker is OPEN due to excessive recent failures.');
    }

    if (channel && this.channelKillSwitches.get(channel)) {
      throw new KillSwitchActiveError(`Kill Switch is ACTIVE for channel: ${channel}`);
    }

    if (campaignId && this.campaignKillSwitches.get(campaignId)) {
      throw new KillSwitchActiveError(`Kill Switch is ACTIVE for campaign: ${campaignId}`);
    }
  }

  recordSuccess() {
    this.failureCount = Math.max(0, this.failureCount - 1);
    if (this.isCircuitOpen && this.failureCount === 0) {
      this.isCircuitOpen = false;
      this.persistence.updateHealth(100, false);
    }
  }

  async recordFailure() {
    this.failureCount += 1;
    if (this.failureCount >= this.failureThreshold) {
      this.isCircuitOpen = true;
      await this.persistence.updateHealth(20, true);
    }
  }

  async setGlobalKillSwitch(active: boolean) {
    this.globalKillSwitch = active;
    await this.persistence.updateHealth(active ? 0 : 100, this.isCircuitOpen, active);
  }

  setChannelKillSwitch(channel: string, active: boolean) {
    this.channelKillSwitches.set(channel, active);
  }

  setCampaignKillSwitch(campaignId: string, active: boolean) {
    this.campaignKillSwitches.set(campaignId, active);
  }

  getCircuitState() {
    return {
      isOpen: this.isCircuitOpen,
      failureCount: this.failureCount,
      globalKillSwitch: this.globalKillSwitch,
    };
  }
}
