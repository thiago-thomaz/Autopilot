import { PlatformActionAdapter, ActionExecutionResult } from './PlatformActionAdapter';
import { ActionStep } from '../../../types/automation/automation.types';

export class InstagramActionAdapter extends PlatformActionAdapter {
  readonly platformName = 'INSTAGRAM';
  async executeAction(step: ActionStep): Promise<ActionExecutionResult> {
    return { success: true, platform: this.platformName, response: { message: `Instagram action ${step.actionType} executed`, step } };
  }
  async rollbackAction(step: ActionStep): Promise<ActionExecutionResult> {
    return { success: true, platform: this.platformName, response: { message: `Instagram action ${step.actionType} rolled back`, step } };
  }
}
