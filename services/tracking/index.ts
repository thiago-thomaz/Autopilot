/**
 * Contrato do Serviço de Rastreamento (Clicks & Atribuição)
 */

export interface TrackClickParams {
  productId: string;
  campaignId?: string;
  channelId?: string;
  source?: string;
  medium?: string;
}

export interface ITrackingService {
  recordClick(params: TrackClickParams): Promise<{ clickId: string }>;
}

export class TrackingService implements ITrackingService {
  async recordClick(_params: TrackClickParams) {
    return { clickId: `click_${Date.now()}` };
  }
}
