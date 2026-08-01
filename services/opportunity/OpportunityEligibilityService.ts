import { prisma } from '../../lib/prisma';

export interface EligibilityResult {
  eligible: boolean;
  blockedReason?: string;
  boostFactor: number;
}

export class OpportunityEligibilityService {
  /**
   * Verifica se o produto está bloqueado na Blocklist ou impulsionado na Allowlist.
   */
  public static async checkEligibility(productId: string, brand?: string, category?: string, title?: string): Promise<EligibilityResult> {
    try {
      // 1. Verificar Blocklist
      const blocklistItems = await prisma.productBlocklist.findMany();
      for (const item of blocklistItems) {
        const val = item.value.toLowerCase();
        if (
          (item.type === 'PRODUCT' && productId === item.value) ||
          (item.type === 'BRAND' && brand && brand.toLowerCase() === val) ||
          (item.type === 'CATEGORY' && category && category.toLowerCase().includes(val)) ||
          (item.type === 'KEYWORD' && title && title.toLowerCase().includes(val))
        ) {
          return {
            eligible: false,
            blockedReason: `Bloqueado por regra de blocklist (${item.type}: ${item.value}). Motivo: ${item.reason || 'Restrição cadastrada.'}`,
            boostFactor: 1.0,
          };
        }
      }

      // 2. Verificar Allowlist (Boost factor)
      let boostFactor = 1.0;
      const allowlistItems = await prisma.productAllowlist.findMany();
      for (const item of allowlistItems) {
        const val = item.value.toLowerCase();
        if (
          (item.type === 'PRODUCT' && productId === item.value) ||
          (item.type === 'BRAND' && brand && brand.toLowerCase() === val) ||
          (item.type === 'CATEGORY' && category && category.toLowerCase().includes(val)) ||
          (item.type === 'KEYWORD' && title && title.toLowerCase().includes(val))
        ) {
          boostFactor = Math.max(boostFactor, item.boostFactor);
        }
      }

      return { eligible: true, boostFactor };
    } catch {
      return { eligible: true, boostFactor: 1.0 };
    }
  }
}
