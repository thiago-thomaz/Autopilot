import { PlatformActionAdapter, ActionExecutionResult } from './PlatformActionAdapter';
import { ActionStep } from '../../../types/automation/automation.types';

export class ThreadsActionAdapter extends PlatformActionAdapter {
  readonly platformName = 'THREADS';
  async executeAction(step: ActionStep): Promise<ActionExecutionResult> {
    return { success: true, platform: this.platformName, response: { message: `Threads action ${step.actionType} executed`, step } };
  }
  async rollbackAction(step: ActionStep): Promise<ActionExecutionResult> {
    return { success: true, platform: this.platformName, response: { message: `Threads action ${step.actionType} rolled back`, step } };
  }
}
