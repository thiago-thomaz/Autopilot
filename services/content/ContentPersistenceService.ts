import { prisma } from '../../lib/prisma';
import { GeneratedContentOutput } from '../../types/content/content.types';
import { ContentPackageStatus, ContentAngleType, ContentPackageType, ChannelPlatform } from '@prisma/client';
import { Logger } from '../../lib/logger';

export interface SaveContentPackageInput {
  productId: string;
  opportunitySnapshotId?: string;
  platform?: string;
  contentType: ContentPackageType;
  channel: ChannelPlatform;
  angle: ContentAngleType;
  generatedOutput: GeneratedContentOutput;
  qualityScore: number;
  complianceScore: number;
  status: ContentPackageStatus;
}

export class ContentPersistenceService {
  /**
   * Salva o ContentPackage e cria automaticamente a primeira versão em ContentVersion via prisma.$transaction().
   */
  public static async saveContentPackage(input: SaveContentPackageInput) {
    const out = input.generatedOutput;

    return await prisma.$transaction(async (tx) => {
      const pkg = await tx.contentPackage.create({
        data: {
          productId: input.productId,
          opportunitySnapshotId: input.opportunitySnapshotId,
          platform: input.platform || 'amazon-brasil',
          contentType: input.contentType,
          channel: input.channel,
          angle: input.angle,
          hook: out.hook,
          title: out.title,
          subtitle: out.subtitle,
          shortDescription: out.shortDescription,
          longDescription: out.longDescription,
          bullets: out.bullets as any,
          caption: out.caption,
          cta: out.cta,
          hashtags: out.hashtags as any,
          keywords: out.keywords as any,
          script: out.script as any,
          visualBrief: out.visualBrief as any,
          affiliateDisclosure: out.affiliateDisclosure,
          generationMetadata: {
            modelUsed: out.modelUsed,
            tokensUsed: out.tokensUsed || 150,
            templateStyle: out.templateStyle,
          },
          qualityScore: input.qualityScore,
          complianceScore: input.complianceScore,
          status: input.status,
        },
      });

      // Criar ContentVersion inicial (v1)
      await tx.contentVersion.create({
        data: {
          contentPackageId: pkg.id,
          version: 1,
          content: out as any,
          model: out.modelUsed,
          qualityScore: input.qualityScore,
          complianceScore: input.complianceScore,
        },
      });

      Logger.info('CONTENT_ENGINE', 'PACKAGE_SAVED', `ContentPackage ${pkg.id} salvo com status ${pkg.status} (Quality: ${input.qualityScore}, Compliance: ${input.complianceScore})`);

      return pkg;
    });
  }

  /**
   * Cria uma nova versão de conteúdo (ex: ao editar ou regenerar).
   */
  public static async createNewVersion(contentPackageId: string, output: GeneratedContentOutput, qualityScore: number, complianceScore: number) {
    const lastVer = await prisma.contentVersion.findFirst({
      where: { contentPackageId },
      orderBy: { version: 'desc' },
    });

    const nextVerNumber = (lastVer?.version || 0) + 1;

    return await prisma.contentVersion.create({
      data: {
        contentPackageId,
        version: nextVerNumber,
        content: output as any,
        model: output.modelUsed,
        qualityScore,
        complianceScore,
      },
    });
  }
}
