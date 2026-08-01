// Types definition for Affiliate Autopilot

export type OperationMode = 'MANUAL' | 'SEMI_AUTOMATICO' | 'AUTOMATICO';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'boolean' | 'number' | 'json';
  description?: string;
  updatedAt: string;
}

export interface AppConfig {
  appName: string;
  defaultCurrency: string;
  defaultTimezone: string;
  defaultLocale: string;
  enableAutomation: boolean;
  operationMode: OperationMode;
}

export interface N8NEventPayload {
  event: string;
  source: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface N8NEventResponse {
  success: boolean;
  eventId?: string;
  message: string;
  processedAt: string;
}

export interface DashboardMetrics {
  monitoredProducts: number;
  foundOffers: number;
  createdContents: number;
  publications: number;
  clicks: number;
  conversions: number;
  commissions: number;
  revenue: number;
}

export * from './predictive/predictive.types';
export * from './predictive/predictive.errors';
export * from './predictive/features.types';
export * from './global/global.types';
export * from './global/global.errors';
export * from './global/localization.types';
export * from './growth';
export * from './business';
export * from './intelligence';






