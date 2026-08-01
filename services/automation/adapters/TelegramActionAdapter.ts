import { PlatformActionAdapter, ActionExecutionResult } from './PlatformActionAdapter';
import { ActionStep } from '../../../types/automation/automation.types';

export class TelegramActionAdapter extends PlatformActionAdapter {
  readonly platformName = 'TELEGRAM';
  async executeAction(step: ActionStep): Promise<ActionExecutionResult> {
    return { success: true, platform: this.platformName, response: { message: `Telegram action ${step.actionType} executed`, step } };
  }
  async rollbackAction(step: ActionStep): Promise<ActionExecutionResult> {
    return { success: true, platform: this.platformName, response: { message: `Telegram action ${step.actionType} rolled back`, step } };
  }
}
