import { PlatformActionAdapter, ActionExecutionResult } from './PlatformActionAdapter';
import { ActionStep } from '../../../types/automation/automation.types';

export class BlogActionAdapter extends PlatformActionAdapter {
  readonly platformName = 'BLOG';

  async executeAction(step: ActionStep): Promise<ActionExecutionResult> {
    return { success: true, platform: this.platformName, response: { message: `Blog action ${step.actionType} executed`, step } };
  }

  async rollbackAction(step: ActionStep): Promise<ActionExecutionResult> {
    return { success: true, platform: this.platformName, response: { message: `Blog action ${step.actionType} rolled back`, step } };
  }
}
