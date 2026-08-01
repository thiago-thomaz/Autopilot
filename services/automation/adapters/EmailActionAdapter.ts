import { PlatformActionAdapter, ActionExecutionResult } from './PlatformActionAdapter';
import { ActionStep } from '../../../types/automation/automation.types';

export class EmailActionAdapter extends PlatformActionAdapter {
  readonly platformName = 'EMAIL';

  async executeAction(step: ActionStep): Promise<ActionExecutionResult> {
    return { success: true, platform: this.platformName, response: { message: `Email campaign action ${step.actionType} executed`, step } };
  }

  async rollbackAction(step: ActionStep): Promise<ActionExecutionResult> {
    return { success: true, platform: this.platformName, response: { message: `Email campaign action ${step.actionType} rolled back`, step } };
  }
}
