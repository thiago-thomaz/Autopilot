/**
 * Contrato do Serviço de Analytics e Métricas
 */

import { DashboardMetrics } from '@/types';

export interface IAnalyticsService {
  getDashboardMetrics(): Promise<DashboardMetrics>;
}

export class AnalyticsService implements IAnalyticsService {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    // Retorno de métricas iniciais (zeradas para Módulo 1)
    return {
      monitoredProducts: 0,
      foundOffers: 0,
      createdContents: 0,
      publications: 0,
      clicks: 0,
      conversions: 0,
      commissions: 0,
      revenue: 0,
    };
  }
}
