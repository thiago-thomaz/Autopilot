import { prisma } from '../lib/prisma';
import { LogLevel } from '@prisma/client';

export interface CreateSystemLogDTO {
  level: LogLevel;
  module: string;
  event: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export class SystemLogRepository {
  static async create(data: CreateSystemLogDTO) {
    try {
      return await prisma.systemLog.create({
        data: {
          level: data.level,
          module: data.module,
          event: data.event,
          message: data.message,
          metadata: data.metadata ? (data.metadata as any) : undefined,
        },
      });
    } catch (error) {
      console.error('Falha ao registrar log no banco de dados:', error);
      return null;
    }
  }

  static async listRecent(limit = 50) {
    try {
      return await prisma.systemLog.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Falha ao listar logs:', error);
      return [];
    }
  }
}
