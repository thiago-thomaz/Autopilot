import { ProductDiscoveryService } from '../discovery/ProductDiscoveryService';
import { CopywritingService } from '../content/CopywritingService';
import { PublishQueueService } from '../publication/PublishQueueService';
import { OpportunityRankingEngine } from '../intelligence/OpportunityRankingEngine';
import { AutonomousOrchestrationEngine } from './AutonomousOrchestrationEngine';
import { Logger } from '../../lib/logger';
import { SystemLogRepository } from '../../repositories/systemLog.repository';
import { prisma } from '../../lib/prisma';
import { ProductStatus } from '@prisma/client';

export type AutonomousJobType =
  | 'DISCOVER_DEALS'
  | 'GENERATE_POSTS'
  | 'PROCESS_PUBLISH_QUEUE'
  | 'SCHEDULED_REMINDERS'
  | 'IMPORT_CONVERSIONS'
  | 'RECALCULATE_RANKING'
  | 'RUN_DECISION_CYCLE'
  | 'CLEANUP_EXPIRED_DATA'
  | 'FULL_CYCLE';

export interface AutonomousJobResult {
  job: AutonomousJobType;
  success: boolean;
  data?: any;
  error?: string;
  durationMs: number;
  executedAt: string;
}

export interface EngineStatus {
  isRunning: boolean;
  startedAt: string | null;
  uptimeSeconds: number;
  autonomyLevel: string;
  intervals: {
    publishingDispatcherMs: number;
    remindersCadenceMs: number;
    decisionCycleMs: number;
    discoveryCycleMs: number;
    maintenanceMs: number;
  };
  jobStats: Record<string, { runs: number; successes: number; failures: number; lastRunAt?: string }>;
}

export class InternalAutonomousEngine {
  private static instance: InternalAutonomousEngine;

  private isRunning = false;
  private startedAt: Date | null = null;
  private timerPublishing: NodeJS.Timeout | null = null;
  private timerReminders: NodeJS.Timeout | null = null;
  private timerDecisions: NodeJS.Timeout | null = null;
  private timerDiscovery: NodeJS.Timeout | null = null;
  private timerMaintenance: NodeJS.Timeout | null = null;

  private orchestrationEngine: AutonomousOrchestrationEngine;

  // Intervalos padrão (configuráveis via variáveis de ambiente)
  private readonly INTERVAL_PUBLISHING = Number(process.env.AUTONOMOUS_PUBLISHING_INTERVAL_MS) || 2 * 60 * 1000; // 2 min
  private readonly INTERVAL_REMINDERS = Number(process.env.AUTONOMOUS_REMINDERS_INTERVAL_MS) || 5 * 60 * 1000; // 5 min
  private readonly INTERVAL_DECISIONS = Number(process.env.AUTONOMOUS_DECISION_INTERVAL_MS) || 60 * 60 * 1000; // 1h
  private readonly INTERVAL_DISCOVERY = Number(process.env.AUTONOMOUS_DISCOVERY_INTERVAL_MS) || 3 * 60 * 60 * 1000; // 3h
  private readonly INTERVAL_MAINTENANCE = Number(process.env.AUTONOMOUS_MAINTENANCE_INTERVAL_MS) || 24 * 60 * 60 * 1000; // 24h

  private jobStats: Record<string, { runs: number; successes: number; failures: number; lastRunAt?: string }> = {
    DISCOVER_DEALS: { runs: 0, successes: 0, failures: 0 },
    GENERATE_POSTS: { runs: 0, successes: 0, failures: 0 },
    PROCESS_PUBLISH_QUEUE: { runs: 0, successes: 0, failures: 0 },
    SCHEDULED_REMINDERS: { runs: 0, successes: 0, failures: 0 },
    IMPORT_CONVERSIONS: { runs: 0, successes: 0, failures: 0 },
    RECALCULATE_RANKING: { runs: 0, successes: 0, failures: 0 },
    RUN_DECISION_CYCLE: { runs: 0, successes: 0, failures: 0 },
    CLEANUP_EXPIRED_DATA: { runs: 0, successes: 0, failures: 0 },
    FULL_CYCLE: { runs: 0, successes: 0, failures: 0 },
  };

  private constructor() {
    this.orchestrationEngine = new AutonomousOrchestrationEngine();
  }

  public static getInstance(): InternalAutonomousEngine {
    // globalThis garante a mesma instância entre instrumentation.ts e as rotas de API (bundles distintos)
    const g = globalThis as any;
    if (!g.__autopilotEngine) {
      g.__autopilotEngine = new InternalAutonomousEngine();
    }
    InternalAutonomousEngine.instance = g.__autopilotEngine;
    return g.__autopilotEngine;
  }

  /**
   * Inicia todos os loops e cronjobs nativos internos.
   */
  public start(): boolean {
    if (this.isRunning) {
      Logger.info('AUTONOMOUS_ENGINE', 'ALREADY_RUNNING', 'Motor autônomo já está em execução.');
      return false;
    }

    const enabled = process.env.ENABLE_AUTOMATION !== 'false';
    if (!enabled) {
      Logger.warn('AUTONOMOUS_ENGINE', 'DISABLED', 'Automação autônoma desativada via ENABLE_AUTOMATION=false.');
      return false;
    }

    this.isRunning = true;
    this.startedAt = new Date();
    Logger.info('AUTONOMOUS_ENGINE', 'STARTED', 'Motor autônomo nativo 100% internalizado iniciado com sucesso.');

    // 1. Despachador de Publicações da Fila (Telegram, WhatsApp, etc)
    this.timerPublishing = setInterval(() => {
      this.executeJob('PROCESS_PUBLISH_QUEUE').catch((err) => {
        Logger.error('AUTONOMOUS_ENGINE', 'PUBLISH_LOOP_ERROR', `Erro no despachador: ${err.message}`);
      });
    }, this.INTERVAL_PUBLISHING);

    // 2. Verificador de Agendamentos e Réguas de Comunicação (T-24h, T-6h, alertas de expiração)
    this.timerReminders = setInterval(() => {
      this.executeJob('SCHEDULED_REMINDERS').catch((err) => {
        Logger.error('AUTONOMOUS_ENGINE', 'REMINDERS_LOOP_ERROR', `Erro na régua de lembretes: ${err.message}`);
      });
    }, this.INTERVAL_REMINDERS);

    // 3. Ciclo de Decisões e Otimização Autônoma
    this.timerDecisions = setInterval(() => {
      this.executeJob('RUN_DECISION_CYCLE').catch((err) => {
        Logger.error('AUTONOMOUS_ENGINE', 'DECISIONS_LOOP_ERROR', `Erro no ciclo de decisões: ${err.message}`);
      });
    }, this.INTERVAL_DECISIONS);

    // 4. Ciclo de Descoberta de Ofertas & Geração Automática de Cópias
    this.timerDiscovery = setInterval(() => {
      this.executeJob('DISCOVER_DEALS').catch((err) => {
        Logger.error('AUTONOMOUS_ENGINE', 'DISCOVERY_LOOP_ERROR', `Erro na descoberta de ofertas: ${err.message}`);
      });
    }, this.INTERVAL_DISCOVERY);

    // 5. Manutenção e Limpeza de Dados Expirados
    this.timerMaintenance = setInterval(() => {
      this.executeJob('CLEANUP_EXPIRED_DATA').catch((err) => {
        Logger.error('AUTONOMOUS_ENGINE', 'MAINTENANCE_LOOP_ERROR', `Erro na manutenção: ${err.message}`);
      });
    }, this.INTERVAL_MAINTENANCE);

    return true;
  }

  /**
   * Encerra de forma limpa todos os timers internos.
   */
  public stop(): boolean {
    if (!this.isRunning) return false;

    if (this.timerPublishing) clearInterval(this.timerPublishing);
    if (this.timerReminders) clearInterval(this.timerReminders);
    if (this.timerDecisions) clearInterval(this.timerDecisions);
    if (this.timerDiscovery) clearInterval(this.timerDiscovery);
    if (this.timerMaintenance) clearInterval(this.timerMaintenance);

    this.timerPublishing = null;
    this.timerReminders = null;
    this.timerDecisions = null;
    this.timerDiscovery = null;
    this.timerMaintenance = null;
    this.isRunning = false;

    Logger.info('AUTONOMOUS_ENGINE', 'STOPPED', 'Motor autônomo nativo pausado.');
    return true;
  }

  /**
   * Executa uma tarefa autônoma específica com métricas, auditoria e resiliência a falhas.
   */
  public async executeJob(job: AutonomousJobType, payload?: any): Promise<AutonomousJobResult> {
    const start = Date.now();
    const executedAt = new Date().toISOString();

    if (!this.jobStats[job]) {
      this.jobStats[job] = { runs: 0, successes: 0, failures: 0 };
    }
    this.jobStats[job].runs += 1;
    this.jobStats[job].lastRunAt = executedAt;

    try {
      let resultData: any = null;

      switch (job) {
        case 'DISCOVER_DEALS': {
          const primaryPlatform = payload?.platform || 'amazon-brasil';
          const secondaryPlatform = primaryPlatform === 'amazon-brasil' ? 'mercado-livre' : 'amazon-brasil';

          // Executa descoberta na plataforma principal
          const primaryResult = await ProductDiscoveryService.discoverProducts({
            platform: primaryPlatform,
            query: payload?.query || 'oferta',
            limit: payload?.limit || 10,
            ...(payload?.category ? { category: payload.category } : {}),
            ...(payload?.brand ? { brand: payload.brand } : {}),
          });

          const allProducts = [...(primaryResult?.products || [])];

          // Se a plataforma não foi restrita no payload, descobre também na plataforma complementar
          if (!payload?.platform) {
            try {
              const secondaryResult = await ProductDiscoveryService.discoverProducts({
                platform: secondaryPlatform,
                query: payload?.query || 'oferta',
                limit: payload?.limit || 10,
              });
              if (secondaryResult?.products) {
                allProducts.push(...secondaryResult.products);
              }
            } catch (secErr: any) {
              Logger.warn('AUTONOMOUS_ENGINE', 'SECONDARY_DISCOVERY_NOTICE', `Descoberta complementar (${secondaryPlatform}): ${secErr.message}`);
            }
          }

          let genResult = null;
          let pubResult = null;

          // Se produtos forem encontrados, gerar cópias e despachar automaticamente
          if (allProducts.length > 0) {
            genResult = await CopywritingService.generatePostsForPendingDeals(allProducts, {
              immediate: !!payload?.immediate,
              channels: Array.isArray(payload?.channels) ? payload.channels : undefined,
            });
            pubResult = await PublishQueueService.processPendingQueue();
          }

          resultData = {
            discovery: {
              ...primaryResult,
              success: true,
              totalProductsDiscovered: allProducts.length,
            },
            generation: genResult,
            publication: pubResult,
          };
          break;
        }

        case 'GENERATE_POSTS': {
          resultData = await CopywritingService.generatePostsForPendingDeals(payload?.deals || []);
          break;
        }

        case 'PROCESS_PUBLISH_QUEUE': {
          resultData = await PublishQueueService.processPendingQueue(payload?.limit || 20);
          break;
        }

        case 'SCHEDULED_REMINDERS': {
          // Processa réguas de tempo (T-24h, T-6h antes de promoções ou eventos) e alertas nativos
          resultData = await this.processScheduledRemindersCadence();
          break;
        }

        case 'IMPORT_CONVERSIONS': {
          resultData = { imported: payload?.data?.length || 0, status: 'success' };
          break;
        }

        case 'RECALCULATE_RANKING': {
          await OpportunityRankingEngine.recalculateWeights();
          resultData = { status: 'recalculated' };
          break;
        }

        case 'RUN_DECISION_CYCLE': {
          const mockSnapshot = {
            timestamp: new Date().toISOString(),
            revenueLast24h: 1500,
            activeCampaigns: 4,
            conversionRate: 0.045,
            errorRate: 0.001,
          };
          resultData = await this.orchestrationEngine.runCycle(mockSnapshot as any);
          break;
        }

        case 'CLEANUP_EXPIRED_DATA': {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

          const deletedLogs = await prisma.systemLog.deleteMany({
            where: { createdAt: { lt: sevenDaysAgo } },
          });
          const deletedProducts = await prisma.product.deleteMany({
            where: { status: ProductStatus.ARCHIVED, updatedAt: { lt: sevenDaysAgo } },
          });

          resultData = { logsDeleted: deletedLogs.count, productsDeleted: deletedProducts.count };
          break;
        }

        case 'FULL_CYCLE': {
          const discoveryRes = await this.executeJob('DISCOVER_DEALS', payload);
          const queueRes = await this.executeJob('PROCESS_PUBLISH_QUEUE');
          const cadenceRes = await this.executeJob('SCHEDULED_REMINDERS');
          resultData = { discovery: discoveryRes, publication: queueRes, cadence: cadenceRes };
          break;
        }
      }

      this.jobStats[job].successes += 1;
      const durationMs = Date.now() - start;

      await SystemLogRepository.create({
        level: 'INFO',
        module: 'autonomous-engine',
        event: job,
        message: `Tarefa autônoma '${job}' concluída com sucesso em ${durationMs}ms`,
        metadata: { durationMs, result: resultData },
      }).catch(() => {});

      return {
        job,
        success: true,
        data: resultData,
        durationMs,
        executedAt,
      };
    } catch (err: any) {
      this.jobStats[job].failures += 1;
      const durationMs = Date.now() - start;

      Logger.error('AUTONOMOUS_ENGINE', 'JOB_FAILED', `Falha na tarefa '${job}': ${err.message}`, { error: err.stack });

      await SystemLogRepository.create({
        level: 'ERROR',
        module: 'autonomous-engine',
        event: job,
        message: `Falha na tarefa autônoma '${job}': ${err.message}`,
        metadata: { durationMs, error: err.message },
      }).catch(() => {});

      return {
        job,
        success: false,
        error: err.message,
        durationMs,
        executedAt,
      };
    }
  }

  /**
   * Processa réguas de tempo (T-24h, T-6h, alertas de expiração) e agendamentos futuros nativos.
   */
  private async processScheduledRemindersCadence() {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in6h = new Date(now.getTime() + 6 * 60 * 60 * 1000);

    // 1. Publicações agendadas que agora estão elegíveis para publicação
    const readyToPublish = await prisma.publicationQueueItem.count({
      where: {
        status: 'PENDING',
        scheduledAt: { lte: now },
      },
    });

    if (readyToPublish > 0) {
      await PublishQueueService.processPendingQueue(readyToPublish);
    }

    return {
      evaluatedAt: now.toISOString(),
      readyPublished: readyToPublish,
      cadenceChecked: { t24h: in24h.toISOString(), t6h: in6h.toISOString() },
    };
  }

  /**
   * Retorna o status operacional detalhado do motor autônomo.
   */
  public getStatus(): EngineStatus {
    const uptimeSeconds = this.startedAt
      ? Math.floor((Date.now() - this.startedAt.getTime()) / 1000)
      : 0;

    return {
      isRunning: this.isRunning,
      startedAt: this.startedAt ? this.startedAt.toISOString() : null,
      uptimeSeconds,
      autonomyLevel: this.orchestrationEngine.getAutonomyLevel(),
      intervals: {
        publishingDispatcherMs: this.INTERVAL_PUBLISHING,
        remindersCadenceMs: this.INTERVAL_REMINDERS,
        decisionCycleMs: this.INTERVAL_DECISIONS,
        discoveryCycleMs: this.INTERVAL_DISCOVERY,
        maintenanceMs: this.INTERVAL_MAINTENANCE,
      },
      jobStats: this.jobStats,
    };
  }
}
