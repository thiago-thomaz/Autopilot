import { NormalizedProductInput } from '../affiliate/types/affiliate.types';
import { ProductRejectionReason } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { Logger } from '../../lib/logger';
import { z } from 'zod';

export interface ValidationResult {
  valid: boolean;
  reason?: ProductRejectionReason;
  errorMessage?: string;
}

export class ProductValidationService {
  /**
   * Valida rigorosamente a integridade do produto descoberto.
   */
  public static validateProduct(product: NormalizedProductInput): ValidationResult {
    if (!product.externalId || product.externalId.trim().length === 0) {
      return { valid: false, reason: 'INVALID_ID', errorMessage: 'ID externo do produto está ausente ou vazio.' };
    }

    if (!product.title || product.title.trim().length < 3) {
      return { valid: false, reason: 'INVALID_TITLE', errorMessage: 'Título do produto muito curto ou ausente.' };
    }

    if (product.currentPrice === undefined || product.currentPrice <= 0 || isNaN(product.currentPrice)) {
      return { valid: false, reason: 'INVALID_PRICE', errorMessage: 'Preço do produto inválido ou menor/igual a zero.' };
    }

    const urlParse = z.string().url().safeParse(product.url);
    if (!urlParse.success) {
      return { valid: false, reason: 'INVALID_URL', errorMessage: 'URL do produto é inválida.' };
    }

    if (product.rating !== undefined && (product.rating < 0 || product.rating > 5)) {
      return { valid: false, reason: 'INVALID_RATING', errorMessage: 'Avaliação (rating) fora do intervalo [0, 5].' };
    }

    return { valid: true };
  }

  /**
   * Registra a rejeição do produto na tabela ProductRejection.
   */
  public static async logRejection(
    platformId: string,
    externalId: string,
    reason: ProductRejectionReason,
    metadata?: Record<string, unknown>
  ) {
    try {
      await prisma.productRejection.create({
        data: {
          platformId,
          externalId,
          reason,
          metadata: metadata ? (metadata as any) : undefined,
        },
      });
      Logger.warn('PRODUCT_DISCOVERY', 'PRODUCT_REJECTED', `Produto ${externalId} rejeitado por motivo: ${reason}`);
    } catch (err: any) {
      Logger.error('PRODUCT_DISCOVERY', 'REJECTION_LOG_ERROR', `Falha ao salvar rejeição de produto: ${err.message}`);
    }
  }
}
