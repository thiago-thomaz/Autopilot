import { PlatformActionAdapter, ActionExecutionResult } from './PlatformActionAdapter';
import { ActionStep } from '../../../types/automation/automation.types';

export class FacebookActionAdapter extends PlatformActionAdapter {
  readonly platformName = 'FACEBOOK';
  async executeAction(step: ActionStep): Promise<ActionExecutionResult> {
    return { success: true, platform: this.platformName, response: { message: `Facebook action ${step.actionType} executed`, step } };
  }
  async rollbackAction(step: ActionStep): Promise<ActionExecutionResult> {
    return { success: true, platform: this.platformName, response: { message: `Facebook action ${step.actionType} rolled back`, step } };
  }
}
