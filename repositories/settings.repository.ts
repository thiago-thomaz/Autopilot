import { prisma } from '../lib/prisma';

export class SettingsRepository {
  static async getByKey(key: string) {
    try {
      return await prisma.setting.findUnique({
        where: { key },
      });
    } catch {
      return null;
    }
  }

  static async upsert(key: string, value: string, type = 'string', description?: string) {
    try {
      return await prisma.setting.upsert({
        where: { key },
        update: { value, type, description },
        create: { key, value, type, description },
      });
    } catch (error) {
      console.error(`Falha ao salvar configuração ${key}:`, error);
      return null;
    }
  }

  static async getAll() {
    try {
      return await prisma.setting.findMany();
    } catch {
      return [];
    }
  }
}
