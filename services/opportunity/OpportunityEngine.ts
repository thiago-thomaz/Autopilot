import { prisma } from '../../lib/prisma';
import { OpportunityAnalysisResult, OpportunityScoringConfig } from '../../types/opportunity/opportunity.types';
import { OpportunityError } from '../../types/opportunity/opportunity.errors';
import { OpportunityFactorService } from './OpportunityFactorService';
import { OpportunityEligibilityService } from './OpportunityEligibilityService';
import { OpportunityScoringService, DEFAULT_OPPORTUNITY_CONFIG } from './OpportunityScoringService';
import { OpportunityClassificationService } from './OpportunityClassificationService';
import { OpportunityExplanationService } from './OpportunityExplanationService';
import { OpportunityPersistenceService } from './OpportunityPersistenceService';
import { inMemoryProducts } from '../discovery/ProductPersistenceService';
import { ProductDiscoveryService } from '../discovery/ProductDiscoveryService';
import { Logger } from '../../lib/logger';

export class OpportunityEngine {
  /**
   * Executa a análise completa de um produto cadastrado no banco por ID.
   */
  public static async analyzeProduct(
    productId: string,
    config: OpportunityScoringConfig = DEFAULT_OPPORTUNITY_CONFIG
  ): Promise<OpportunityAnalysisResult> {
    let product: any = null;
    try {
      product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          priceHistory: { orderBy: { capturedAt: 'asc' } },
          affiliatePlatform: true,
        },
      });
    } catch {
      // DB offline fallback
    }

    if (!product) {
      const foundInMemory = inMemoryProducts.find((p) => p.id === productId);
      if (foundInMemory) {
        product = {
          ...foundInMemory,
          priceHistory: foundInMemory.priceHistory || [],
          affiliatePlatform: foundInMemory.affiliatePlatform || { name: 'Amazon Brasil', slug: 'amazon-brasil' },
        };
      }
    }

    if (!product) {
      throw new OpportunityError(`Produto com ID '${productId}' não encontrado.`, 'PRODUCT_NOT_FOUND', 404);
    }

    // 1. Verificar Elegibilidade (Blocklist / Allowlist)
    const eligibility = await OpportunityEligibilityService.checkEligibility(
      product.id,
      product.brand || undefined,
      product.category || undefined,
      product.title
    );

    if (!eligibility.eligible) {
      throw new OpportunityError(
        eligibility.blockedReason || 'Produto bloqueado por regras de restrição.',
        'PRODUCT_BLOCKED',
        400
      );
    }

    // 2. Extrair Fatores Brutos
    const rawFactors = OpportunityFactorService.extractFactors({
      id: product.id,
      externalId: product.externalId,
      title: product.title,
      description: product.description || undefined,
      url: product.url,
      imageUrl: product.imageUrl || undefined,
      category: product.category || undefined,
      brand: product.brand || undefined,
      currentPrice: product.currentPrice,
      previousPrice: product.previousPrice || undefined,
      rating: product.rating || undefined,
      reviewCount: product.reviewCount || 0,
      availability: product.availability,
      commissionRate: product.commissionRate || undefined,
      estimatedCommission: product.estimatedCommission || undefined,
      priceHistory: product.priceHistory.map((h) => ({ price: h.price, capturedAt: h.capturedAt })),
    });

    // 3. Calcular Score com Clamp (0..100)
    const scoreCalc = OpportunityScoringService.calculate(rawFactors, config, eligibility.boostFactor);

    // 4. Classificar Faixa e Prioridade (P0 a P4)
    const { classification, priority } = OpportunityClassificationService.classify(scoreCalc.score);

    // 5. Gerar Explicação Detalhada
    const explanation = OpportunityExplanationService.generateExplanation(
      rawFactors,
      scoreCalc.bonusesApplied,
      scoreCalc.penaltiesApplied
    );

    const result: OpportunityAnalysisResult = {
      productId: product.id,
      score: scoreCalc.score,
      confidenceScore: scoreCalc.confidenceScore,
      adjustedScore: scoreCalc.adjustedScore,
      classification,
      priority,
      factorScores: scoreCalc.factorScores,
      bonusesApplied: scoreCalc.bonusesApplied,
      penaltiesApplied: scoreCalc.penaltiesApplied,
      explanation,
      algorithmVersion: config.algorithmVersion || 'v1.0.0',
      createdAt: new Date(),
    };

    // 6. Persistir Snapshot em Banco
    await OpportunityPersistenceService.saveSnapshot(result);

    return result;
  }

  /**
   * Recalcula a análise de oportunidade em lote para todos os produtos ativos.
   */
  public static async analyzeBatch(limit = 100): Promise<{ processed: number; failed: number }> {
    let products: { id: string }[] = [];
    try {
      products = await prisma.product.findMany({
        take: limit,
        select: { id: true },
        orderBy: { updatedAt: 'desc' },
      });
    } catch {
      // DB offline fallback
    }

    if (products.length === 0 && inMemoryProducts.length === 0) {
      try {
        await ProductDiscoveryService.discoverProducts({
          platform: 'amazon-brasil',
          query: 'Gourmet',
        });
      } catch (err) {
        Logger.warn('OPPORTUNITY_ENGINE', 'AUTO_DISCOVERY_FALLBACK_FAILED', `Falha ao executar descoberta automatica: ${err}`);
      }
    }

    if (products.length === 0 && inMemoryProducts.length > 0) {
      products = inMemoryProducts.slice(0, limit).map((p) => ({ id: p.id }));
    }

    let processed = 0;
    let failed = 0;

    for (const p of products) {
      try {
        await this.analyzeProduct(p.id);
        processed++;
      } catch (err: any) {
        failed++;
        Logger.error('OPPORTUNITY_ENGINE', 'BATCH_FAILED_ITEM', `Erro ao analisar produto ${p.id}: ${err.message}`);
      }
    }

    return { processed, failed };
  }

  /**
   * Simulação em tempo real de score (para a ferramenta de simulação na UI) sem gravar no banco.
   */
  public static simulateScore(rawFactorsInput: any, config: OpportunityScoringConfig = DEFAULT_OPPORTUNITY_CONFIG) {
    const rawFactors = OpportunityFactorService.extractFactors(rawFactorsInput);
    const scoreCalc = OpportunityScoringService.calculate(rawFactors, config, 1.0);
    const { classification, priority } = OpportunityClassificationService.classify(scoreCalc.score);
    const explanation = OpportunityExplanationService.generateExplanation(
      rawFactors,
      scoreCalc.bonusesApplied,
      scoreCalc.penaltiesApplied
    );

    return {
      score: scoreCalc.score,
      confidenceScore: scoreCalc.confidenceScore,
      adjustedScore: scoreCalc.adjustedScore,
      classification,
      priority,
      factorScores: scoreCalc.factorScores,
      bonusesApplied: scoreCalc.bonusesApplied,
      penaltiesApplied: scoreCalc.penaltiesApplied,
      explanation,
    };
  }
}
