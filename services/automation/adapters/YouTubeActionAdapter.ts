import { PlatformActionAdapter, ActionExecutionResult } from './PlatformActionAdapter';
import { ActionStep } from '../../../types/automation/automation.types';

export class YouTubeActionAdapter extends PlatformActionAdapter {
  readonly platformName = 'YOUTUBE';
  async executeAction(step: ActionStep): Promise<ActionExecutionResult> {
    return { success: true, platform: this.platformName, response: { message: `YouTube action ${step.actionType} executed`, step } };
  }
  async rollbackAction(step: ActionStep): Promise<ActionExecutionResult> {
    return { success: true, platform: this.platformName, response: { message: `YouTube action ${step.actionType} rolled back`, step } };
  }
}
