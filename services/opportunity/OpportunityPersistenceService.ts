import { prisma } from '../../lib/prisma';
import { OpportunityAnalysisResult } from '../../types/opportunity/opportunity.types';
import { Logger } from '../../lib/logger';

export class OpportunityPersistenceService {
  /**
   * Grava o snapshot de análise no banco de dados e atualiza a coluna `opportunityScore` na tabela Product.
   */
  public static async saveSnapshot(result: OpportunityAnalysisResult) {
    try {
      return await prisma.$transaction(async (tx) => {
        const snapshot = await tx.opportunitySnapshot.create({
          data: {
            productId: result.productId,
            score: result.score,
            adjustedScore: result.adjustedScore,
            confidenceScore: result.confidenceScore,
            classification: result.classification,
            priority: result.priority,
            priceScore: result.factorScores.priceScore,
            priceHistoryScore: result.factorScores.priceHistoryScore,
            discountScore: result.factorScores.discountScore,
            ratingScore: result.factorScores.ratingScore,
            reviewScore: result.factorScores.reviewScore,
            commissionScore: result.factorScores.commissionScore,
            demandScore: result.factorScores.demandScore,
            availabilityScore: result.factorScores.availabilityScore,
            contentScore: result.factorScores.contentScore,
            dataQualityScore: result.factorScores.dataQualityScore,
            bonuses: result.bonusesApplied as any,
            penalties: result.penaltiesApplied as any,
            explanation: result.explanation as any,
            algorithmVersion: result.algorithmVersion || 'v1.0.0',
          },
        });

        // Atualizar produto com o score e o status caso seja aprovado por score elevado
        await tx.product.update({
          where: { id: result.productId },
          data: {
            opportunityScore: result.score,
            status: result.score >= 70 ? 'APPROVED' : 'DISCOVERED',
          },
        });

        // Criar Alertas em caso de produto EXCEPTIONAL
        if (result.classification === 'EXCEPTIONAL') {
          await tx.opportunityAlert.create({
            data: {
              productId: result.productId,
              type: 'NEW_EXCEPTIONAL_PRODUCT',
              scoreDelta: result.score,
              status: 'UNREAD',
            },
          });
        }

        Logger.info(
          'OPPORTUNITY_ENGINE',
          'SNAPSHOT_SAVED',
          `Snapshot de oportunidade salvo para produto ${result.productId}: Score ${result.score} (${result.classification})`
        );

        return snapshot;
      });
    } catch (err: any) {
      Logger.error('OPPORTUNITY_ENGINE', 'PERSISTENCE_FAILED', `Falha ao salvar snapshot: ${err.message}`);
      throw err;
    }
  }

  /**
   * Obtém o snapshot mais recente de um produto.
   */
  public static async getLatestSnapshot(productId: string) {
    return await prisma.opportunitySnapshot.findFirst({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      include: { product: { include: { affiliatePlatform: true } } },
    });
  }

  /**
   * Obtém o histórico de snapshots de um produto.
   */
  public static async getSnapshotHistory(productId: string, limit = 20) {
    return await prisma.opportunitySnapshot.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
