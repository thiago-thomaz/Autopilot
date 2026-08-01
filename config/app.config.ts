import { AppConfig } from '@/types';

export const DEFAULT_APP_CONFIG: AppConfig = {
  appName: process.env.APP_NAME || 'Affiliate Autopilot',
  defaultCurrency: process.env.DEFAULT_CURRENCY || 'BRL',
  defaultTimezone: process.env.DEFAULT_TIMEZONE || 'America/Sao_Paulo',
  defaultLocale: process.env.DEFAULT_LOCALE || 'pt-BR',
  enableAutomation: process.env.ENABLE_AUTOMATION === 'true' ? true : false,
  operationMode: (process.env.OPERATION_MODE as AppConfig['operationMode']) || 'MANUAL',
};
