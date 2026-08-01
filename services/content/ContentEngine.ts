import { prisma } from '../../lib/prisma';
import { ContentEngineError } from '../../types/content/content.errors';
import { ProductFactExtractor } from './ProductFactExtractor';
import { ContentAngleService } from './ContentAngleService';
import { ContentBriefBuilder } from './ContentBriefBuilder';
import { LLMProviderAdapter } from './adapters/LLMProviderAdapter';
import { MockLLMAdapter } from './adapters/MockLLMAdapter';
import { OpenAIAdapter } from './adapters/OpenAIAdapter';
import { GeminiAdapter } from './adapters/GeminiAdapter';
import { ContentValidationService } from './ContentValidationService';
import { ContentQualityService } from './ContentQualityService';
import { ContentPersistenceService } from './ContentPersistenceService';
import { ContentAngleType, ContentPackageType, ChannelPlatform, ContentPackageStatus } from '@prisma/client';
import { Logger } from '../../lib/logger';

export class ContentEngine {
  private static getLLMAdapter(providerName?: string): LLMProviderAdapter {
    if (process.env.AFFILIATE_MOCK_MODE === 'true' || process.env.MOCK_LLM === 'true' || providerName === 'MockLLM') {
      return new MockLLMAdapter();
    }
    if (providerName === 'OpenAI') return new OpenAIAdapter();
    if (providerName === 'Gemini') return new GeminiAdapter();
    return new MockLLMAdapter();
  }

  /**
   * Gera um ContentPackage completo para um produto especificando o ângulo e o canal.
   */
  public static async generateContentPackage(
    productId: string,
    targetAngle?: ContentAngleType,
    targetChannel: ChannelPlatform = 'INSTAGRAM',
    targetContentType: ContentPackageType = 'SOCIAL_POST',
    providerName = 'MockLLM'
  ) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        opportunitySnapshots: { orderBy: { createdAt: 'desc' }, take: 1 },
        affiliatePlatform: true,
      },
    });

    if (!product) {
      throw new ContentEngineError(`Produto com ID '${productId}' não encontrado.`, 'PRODUCT_NOT_FOUND', 404);
    }

    const latestSnapshot = product.opportunitySnapshots[0];

    // 1. Extração Anti-Alucinação de Fatos
    const verifiedFacts = ProductFactExtractor.extractFacts({
      externalId: product.externalId,
      title: product.title,
      description: product.description || undefined,
      url: product.url,
      currentPrice: product.currentPrice,
      previousPrice: product.previousPrice || undefined,
      rating: product.rating || undefined,
      reviewCount: product.reviewCount || 0,
      brand: product.brand || undefined,
      category: product.category || undefined,
    });

    // 2. Seleção de Ângulo Estratégico
    const angle = targetAngle || ContentAngleService.selectBestAngle(product.currentPrice, product.previousPrice || undefined, product.category || undefined);

    // 3. Seleção de Adapter LLM
    const adapter = this.getLLMAdapter(providerName);

    // 4. Execução da Geração no Provider LLM
    const generatedOutput = await adapter.generateContent({
      productId: product.id,
      title: product.title,
      category: product.category || undefined,
      brand: product.brand || undefined,
      currentPrice: product.currentPrice,
      previousPrice: product.previousPrice || undefined,
      url: product.url,
      rating: product.rating || undefined,
      reviewCount: product.reviewCount || 0,
      commissionRate: product.commissionRate || undefined,
      estimatedCommission: product.estimatedCommission || undefined,
      angle,
      channel: targetChannel,
      contentType: targetContentType,
      verifiedFacts,
    });

    // 5. Validação Anti-Alucinação de Claims (Claim Validation)
    const textToValidate = `${generatedOutput.hook} ${generatedOutput.title} ${generatedOutput.caption}`;
    const claimValidation = ContentValidationService.validateClaims(textToValidate, verifiedFacts);

    // 6. Cálculo do Quality Score & Compliance Score
    const { qualityScore, complianceScore } = ContentQualityService.calculateQualityScores(
      generatedOutput,
      !claimValidation.valid
    );

    // 7. Quality Gate: Decisão de Status (READY_FOR_PUBLICATION vs REVIEW_REQUIRED)
    let status: ContentPackageStatus = 'REVIEW_REQUIRED';
    if (qualityScore >= 80 && complianceScore >= 90 && claimValidation.valid) {
      status = 'READY_FOR_PUBLICATION';
    }

    // 8. Salvar no Banco via Transação Prisma
    const savedPackage = await ContentPersistenceService.saveContentPackage({
      productId: product.id,
      opportunitySnapshotId: latestSnapshot?.id,
      platform: product.affiliatePlatform.slug,
      contentType: targetContentType,
      channel: targetChannel,
      angle,
      generatedOutput,
      qualityScore,
      complianceScore,
      status,
    });

    return { package: savedPackage, validation: claimValidation };
  }

  /**
   * Gera obrigatoriamente 3 variações de pacotes de conteúdo por oportunidade (ex: DEAL, PROBLEM_SOLUTION, COMPARISON).
   */
  public static async generatePackageVariations(productId: string) {
    const angles: ContentAngleType[] = ['DEAL', 'PROBLEM_SOLUTION', 'COMPARISON'];
    const results = [];

    for (const angle of angles) {
      const res = await this.generateContentPackage(productId, angle, 'INSTAGRAM', 'SOCIAL_POST');
      results.push(res);
    }

    return results;
  }

  /**
   * Regeneração pontual de um pacote de conteúdo existente.
   */
  public static async regeneratePackage(packageId: string) {
    const pkg = await prisma.contentPackage.findUnique({
      where: { id: packageId },
      include: { product: true },
    });

    if (!pkg) {
      throw new ContentEngineError(`ContentPackage com ID '${packageId}' não encontrado.`, 'PACKAGE_NOT_FOUND', 404);
    }

    const adapter = this.getLLMAdapter();
    const verifiedFacts = ProductFactExtractor.extractFacts(pkg.product);

    const generatedOutput = await adapter.generateContent({
      productId: pkg.productId,
      title: pkg.product.title,
      category: pkg.product.category || undefined,
      brand: pkg.product.brand || undefined,
      currentPrice: pkg.product.currentPrice,
      previousPrice: pkg.product.previousPrice || undefined,
      url: pkg.product.url,
      rating: pkg.product.rating || undefined,
      reviewCount: pkg.product.reviewCount || 0,
      angle: pkg.angle,
      channel: pkg.channel,
      contentType: pkg.contentType,
      verifiedFacts,
    });

    const textToValidate = `${generatedOutput.hook} ${generatedOutput.title} ${generatedOutput.caption}`;
    const claimValidation = ContentValidationService.validateClaims(textToValidate, verifiedFacts);
    const { qualityScore, complianceScore } = ContentQualityService.calculateQualityScores(
      generatedOutput,
      !claimValidation.valid
    );

    let status: ContentPackageStatus = 'REVIEW_REQUIRED';
    if (qualityScore >= 80 && complianceScore >= 90 && claimValidation.valid) {
      status = 'READY_FOR_PUBLICATION';
    }

    // Criar nova versão e atualizar pacote
    await ContentPersistenceService.createNewVersion(pkg.id, generatedOutput, qualityScore, complianceScore);

    const updatedPkg = await prisma.contentPackage.update({
      where: { id: packageId },
      data: {
        hook: generatedOutput.hook,
        title: generatedOutput.title,
        caption: generatedOutput.caption,
        cta: generatedOutput.cta,
        qualityScore,
        complianceScore,
        status,
      },
    });

    return updatedPkg;
  }
}
