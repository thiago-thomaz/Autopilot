import { z } from 'zod';

export const systemSettingsSchema = z.object({
  appName: z.string().min(1),
  defaultCurrency: z.string().length(3),
  defaultTimezone: z.string().min(1),
  defaultLocale: z.string().min(1),
  enableAutomation: z.boolean(),
  operationMode: z.enum(['MANUAL', 'SEMI_AUTOMATICO', 'AUTOMATICO']),
});

export type SystemSettingsInput = z.infer<typeof systemSettingsSchema>;
