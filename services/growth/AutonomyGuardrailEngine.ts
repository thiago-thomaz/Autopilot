import { GrowthGuardrailCheckResult, GrowthAutomationLevel } from '../../types/growth/growth.types';
import { KillSwitchActiveError } from '../../types/growth/growth.errors';

export interface ActionSecurityContext {
  actionName: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  proposedBudget?: number;
  channel?: string;
  country?: string;
  productId?: string;
  affiliateProgramId?: string;
}

export class AutonomyGuardrailEngine {
  public shadowMode: boolean = true;
  public automationLevel: GrowthAutomationLevel = 'SUPERVISED';
  public globalKillSwitch: boolean = false;

  public channelKillSwitches: Set<string> = new Set();
  public countryKillSwitches: Set<string> = new Set();
  public productKillSwitches: Set<string> = new Set();
  public affiliateProgramKillSwitches: Set<string> = new Set();

  public maxSingleCampaignBudgetCap: number = 1000;

  public setGlobalKillSwitch(active: boolean): void {
    this.globalKillSwitch = active;
  }

  public setChannelKillSwitch(channel: string, active: boolean): void {
    if (active) this.channelKillSwitches.add(channel.toUpperCase());
    else this.channelKillSwitches.delete(channel.toUpperCase());
  }

  public setCountryKillSwitch(country: string, active: boolean): void {
    if (active) this.countryKillSwitches.add(country.toUpperCase());
    else this.countryKillSwitches.delete(country.toUpperCase());
  }

  public evaluateAction(context: ActionSecurityContext): GrowthGuardrailCheckResult {
    const reasons: string[] = [];

    // 1. Kill switch checks
    if (this.globalKillSwitch) {
      throw new KillSwitchActiveError('GLOBAL');
    }
    if (context.channel && this.channelKillSwitches.has(context.channel.toUpperCase())) {
      throw new KillSwitchActiveError(`Channel:${context.channel}`);
    }
    if (context.country && this.countryKillSwitches.has(context.country.toUpperCase())) {
      throw new KillSwitchActiveError(`Country:${context.country}`);
    }
    if (context.productId && this.productKillSwitches.has(context.productId)) {
      throw new KillSwitchActiveError(`Product:${context.productId}`);
    }

    // 2. Budget limits check
    if (context.proposedBudget && context.proposedBudget > this.maxSingleCampaignBudgetCap) {
      reasons.push(`Budget (${context.proposedBudget}) exceeds cap (${this.maxSingleCampaignBudgetCap})`);
    }

    // 3. Autonomy mode & Risk level logic
    let requiresApproval = false;
    if (this.automationLevel === 'MANUAL') {
      requiresApproval = true;
      reasons.push('System in MANUAL mode');
    } else if (this.automationLevel === 'ASSISTED') {
      requiresApproval = context.riskLevel !== 'LOW';
      if (requiresApproval) reasons.push('ASSISTED mode requires approval for non-LOW risk actions');
    } else if (this.automationLevel === 'SUPERVISED') {
      requiresApproval = context.riskLevel === 'HIGH' || context.riskLevel === 'CRITICAL';
      if (requiresApproval) reasons.push('SUPERVISED mode requires approval for HIGH/CRITICAL risk actions');
    } else if (this.automationLevel === 'AUTONOMOUS') {
      requiresApproval = context.riskLevel === 'CRITICAL';
      if (requiresApproval) reasons.push('AUTONOMOUS mode requires approval for CRITICAL risk actions');
    }

    if (this.shadowMode) {
      reasons.push('SHADOW_MODE is active: Action simulated without real external execution');
    }

    const passed = reasons.length === 0 || this.shadowMode;

    return {
      passed,
      actionRisk: context.riskLevel,
      automationLevel: this.automationLevel,
      shadowModeActive: this.shadowMode,
      killSwitchTriggered: false,
      requiresManualApproval: requiresApproval,
      reasons
    };
  }
}
