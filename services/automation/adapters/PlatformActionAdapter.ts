import { ActionStep } from '../../../types/automation/automation.types';

export interface ActionExecutionResult {
  success: boolean;
  platform: string;
  actionId?: string;
  response?: any;
  error?: string;
}

export abstract class PlatformActionAdapter {
  abstract readonly platformName: string;

  abstract executeAction(step: ActionStep): Promise<ActionExecutionResult>;
  abstract rollbackAction(step: ActionStep): Promise<ActionExecutionResult>;
}
