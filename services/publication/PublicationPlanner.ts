import { OmnichannelChannel, ContentPackageStatus } from '@prisma/client';
import { PublicationPlanRequest, PublicationPlanResult } from '../../types/publication/publication.types';
import { PublicationPersistenceService } from './PublicationPersistenceService';
import { TrackingAdapter } from './TrackingAdapter';
import { LocalizationEngine } from './LocalizationEngine';
import { PublicationComplianceEngine } from './PublicationComplianceEngine';
import { PlatformPolicyEngine } from './PlatformPolicyEngine';
import { prisma } from '../../lib/prisma';
import { PublicationEngineError } from '../../types/publication/publication.errors';
import { ContentStrategyEngine } from '../content/ContentStrategyEngine';

export class PublicationPlanner {
  /**
   * Gera o plano de distribuição omnichannel para um pacote de conteúdo aprovado.
   */
  public static async createPlan(request: PublicationPlanRequest): Promise<PublicationPlanResult> {
    const pkg = await prisma.contentPackage.findUnique({
      where: { id: request.contentPackageId },
      include: { product: true },
    });

    if (!pkg) {
      throw new PublicationEngineError(`ContentPackage com ID '${request.contentPackageId}' não encontrado.`, 'PACKAGE_NOT_FOUND', 404);
    }

    if (pkg.status !== ('READY_FOR_PUBLICATION' as ContentPackageStatus) && pkg.status !== ('APPROVED' as ContentPackageStatus)) {
      throw new PublicationEngineError(`Pacote de conteúdo deve estar com status READY_FOR_PUBLICATION para agendamento.`, 'INVALID_PACKAGE_STATUS', 400);
    }

    const defaultChannels: OmnichannelChannel[] = ['INSTAGRAM', 'TELEGRAM', 'WHATSAPP', 'OWN_WEBSITE'];
    const channels = request.channels && request.channels.length > 0 ? request.channels : defaultChannels;

    const defaultCountries = ['BR', 'US'];
    const countries = request.targetCountries && request.targetCountries.length > 0 ? request.targetCountries : defaultCountries;

    const createdPublications = [];
    const planId = `plan_${Date.now()}`;

    for (const channel of channels) {
      for (const country of countries) {
        const language = country === 'US' ? 'en-US' : 'pt-BR';
        const currency = country === 'US' ? 'USD' : 'BRL';
        const timezone = country === 'US' ? 'America/New_York' : 'America/Sao_Paulo';

        // 1. Localização de Preço
        const { convertedAmount } = LocalizationEngine.convertCurrency(pkg.product.currentPrice, pkg.product.currency, currency);
        const formattedPrice = LocalizationEngine.formatPrice(convertedAmount, currency, language);

        // 2. Link de Rastreamento com UTM Ricas
        const trackingUrl = TrackingAdapter.buildTrackingUrl(pkg.product.url, channel, country, language, request.campaignId || 'default', 'v1');

        // 3. Formatação e Compliance do Texto
        let text = pkg.caption ? pkg.caption.replace(pkg.product.url, trackingUrl) : `${pkg.hook}\n\n${pkg.title} por apenas ${formattedPrice}!\n\n${pkg.cta}\n${trackingUrl}`;
        if (pkg.caption && !text.includes(trackingUrl)) {
          text += `\n\n${trackingUrl}`;
        }
        text = PlatformPolicyEngine.truncateForPlatform(text, channel);
        text = PublicationComplianceEngine.ensureComplianceDisclosure(text, country);

        // Formatação nativa para WhatsApp
        if (channel === 'WHATSAPP') {
          text = text.replace(/\*\*(.*?)\*\*/g, '*$1*');
        }

        // 4. Agendamento Inteligente
        const optimalSchedule = request.scheduledAt || ContentStrategyEngine.determineOptimalSchedule(pkg.product);

        // 5. Chave de Idempotência Única
        const idempotencyKey = `${pkg.id}_${channel}_${country}_${optimalSchedule.getTime()}`;

        const payload = {
          title: pkg.title,
          body: text,
          trackingUrl,
          affiliateDisclosure: pkg.affiliateDisclosure || '#afiliado',
          cta: pkg.cta,
          formattedPrice,
        };

        const record = await PublicationPersistenceService.createPublicationRecord({
          contentPackageId: pkg.id,
          productId: pkg.productId,
          channel,
          platform: channel.toLowerCase(),
          publicationType: channel === 'REDDIT' ? 'MANUAL' : 'AUTOMATIC',
          status: 'QUEUED',
          publicationPayload: payload,
          trackingUrl,
          scheduledAt: optimalSchedule,
          country,
          language,
          currency,
          timezone,
          campaignId: request.campaignId,
          idempotencyKey,
        });

        createdPublications.push({
          id: record.id,
          channel: record.channel,
          country: record.country,
          language: record.language,
          status: record.status,
          scheduledAt: record.scheduledAt,
        });
      }
    }

    return {
      planId,
      totalPublications: createdPublications.length,
      channelsPlanned: channels,
      countriesPlanned: countries,
      publications: createdPublications,
    };
  }
}
