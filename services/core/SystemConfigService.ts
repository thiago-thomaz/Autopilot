import { PrismaClient } from '@prisma/client';
import { Logger } from '../../lib/logger';

const prisma = new PrismaClient();

export class SystemConfigService {
  /**
   * Retrieves a configuration by key. If it doesn't exist, creates it with the defaultValue.
   */
  static async getConfig<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const config = await prisma.systemConfig.findUnique({
        where: { key }
      });

      if (!config) {
        await prisma.systemConfig.create({
          data: {
            key,
            value: JSON.stringify(defaultValue),
            description: `Auto-generated config for ${key}`
          }
        });
        return defaultValue;
      }

      // Handle raw db JSON strings or objects correctly
      const value = typeof config.value === 'string' ? JSON.parse(config.value) : config.value;
      return value as T;
    } catch (error) {
      Logger.error('SYSTEM_CONFIG', 'DB_ERROR', `[SystemConfigService] Error fetching config ${key}`, { error });
      return defaultValue; // Fallback to default in case of DB error
    }
  }

  /**
   * Updates an existing configuration or creates it.
   */
  static async setConfig<T>(key: string, value: T, description?: string): Promise<void> {
    try {
      await prisma.systemConfig.upsert({
        where: { key },
        update: {
          value: JSON.stringify(value),
          ...(description && { description })
        },
        create: {
          key,
          value: JSON.stringify(value),
          description: description || `Config for ${key}`
        }
      });
      Logger.info('SYSTEM_CONFIG', 'CONFIG_UPDATED', `[SystemConfigService] Config updated`, { key, value });
    } catch (error) {
      Logger.error('SYSTEM_CONFIG', 'DB_ERROR', `[SystemConfigService] Error setting config ${key}`, { error });
      // If DB fails, we still set in memory for this instance
      Logger.warn('SYSTEM_CONFIG', 'MEMORY_FALLBACK', `[SystemConfigService] Falling back to memory for config ${key}`, { error });
    }
  }

  // --- Convenience Methods for P0 Requirements ---

  /**
   * Global Kill Switch
   * If false, the autopilot should halt its main loops (Discovery, Queue, Publication)
   */
  static async isGlobalAutopilotEnabled(): Promise<boolean> {
    return this.getConfig<boolean>('AUTOPILOT_ENABLED', true);
  }

  /**
   * Sub-component Kill Switches
   */
  static async isComponentEnabled(component: 'TELEGRAM' | 'WHATSAPP' | 'AMAZON' | 'MERCADOLIVRE' | 'DISCOVERY' | 'PUBLICATION'): Promise<boolean> {
    return this.getConfig<boolean>(`${component}_ENABLED`, true);
  }

  /**
   * Check if we are in DRY_RUN mode.
   * If true, tracking, scoring and queueing run normally, but NO real API publication happens.
   */
  static async isDryRun(): Promise<boolean> {
    return this.getConfig<boolean>('DRY_RUN', false);
  }

  /**
   * Retrieves Anti-Spam limits
   */
  static async getAntiSpamConfig() {
    return this.getConfig('ANTI_SPAM_CONFIG', {
      MAX_POSTS_PER_HOUR: 10,
      MAX_POSTS_PER_DAY: 100,
      MIN_SECONDS_BETWEEN_POSTS: 300,
      PRODUCT_COOLDOWN_MINUTES: 10080, // 7 days default
      CATEGORY_COOLDOWN_MINUTES: 60,
      SELLER_COOLDOWN_MINUTES: 120,
      MARKETPLACE_COOLDOWN_MINUTES: 0
    });
  }
}
