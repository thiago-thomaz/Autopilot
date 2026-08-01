import { PlatformActionAdapter, ActionExecutionResult } from './PlatformActionAdapter';
import { ActionStep } from '../../../types/automation/automation.types';

export class WebsiteActionAdapter extends PlatformActionAdapter {
  readonly platformName = 'WEBSITE';

  async executeAction(step: ActionStep): Promise<ActionExecutionResult> {
    return {
      success: true,
      platform: this.platformName,
      response: { message: `Website action ${step.actionType} executed`, step },
    };
  }

  async rollbackAction(step: ActionStep): Promise<ActionExecutionResult> {
    return {
      success: true,
      platform: this.platformName,
      response: { message: `Website action ${step.actionType} rolled back`, step },
    };
  }
}
