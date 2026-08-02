import { PrismaClient } from '@prisma/client';
import { OpportunityEngine } from '../services/opportunity/OpportunityEngine';
import { ContentEngine } from '../services/content/ContentEngine';
import { PublicationPlanner } from '../services/publication/PublicationPlanner';
import { PublicationWorker } from '../services/publication/PublicationWorker';
import { AnalyticsPersistenceService } from '../services/analytics/AnalyticsPersistenceService';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Populando dados de semente para Módulo 7 (Analytics, Attribution & Profit Intelligence)...');

  // 1. Perfis de Mercado Globais
  const markets = [
    { countryCode: 'BR', countryName: 'Brasil', defaultLanguage: 'pt-BR', defaultCurrency: 'BRL', defaultTimezone: 'America/Sao_Paulo' },
    { countryCode: 'US', countryName: 'Estados Unidos', defaultLanguage: 'en-US', defaultCurrency: 'USD', defaultTimezone: 'America/New_York' },
  ];

  for (const m of markets) {
    await prisma.marketProfile.upsert({
      where: { countryCode: m.countryCode },
      update: m,
      create: m,
    });
  }

  // 2. Plataforma de Afiliados
  const amazon = await prisma.affiliatePlatform.upsert({
    where: { slug: 'amazon-brasil' },
    update: {},
    create: {
      name: 'Amazon Brasil',
      slug: 'amazon-brasil',
      status: 'ACTIVE',
      apiAvailable: true,
      productDiscoveryAvailable: true,
      website: 'https://www.amazon.com.br',
    },
  });

  // 3. Produto DEMO Principal
  const product = await prisma.product.upsert({
    where: {
      affiliatePlatformId_externalId: {
        affiliatePlatformId: amazon.id,
        externalId: 'B08N5WRWNW',
      },
    },
    update: { lastSyncedAt: new Date() },
    create: {
      externalId: 'B08N5WRWNW',
      title: 'Kindle Paperwhite 16GB Tela 6.8" com Luz Quente',
      description: 'Kindle Paperwhite com tela de 6,8 polegadas e luz quente ajustável.',
      url: 'https://www.amazon.com.br/dp/B08N5WRWNW?tag=thomazpromos-20',
      imageUrl: 'https://m.media-amazon.com/images/I/61gS9lK8rQL._AC_SL1500_.jpg',
      category: 'Informática',
      brand: 'Amazon',
      currentPrice: 749.0,
      previousPrice: 899.0,
      rating: 4.8,
      reviewCount: 4500,
      availability: true,
      commissionRate: 0.09,
      estimatedCommission: 67.41,
      affiliatePlatformId: amazon.id,
      collectedAt: new Date(),
      lastSyncedAt: new Date(),
    },
  });

  // 4. Análise de Oportunidade & Conteúdo
  await OpportunityEngine.analyzeProduct(product.id);
  const contentPackageRes = await ContentEngine.generateContentPackage(product.id, 'DEAL', 'INSTAGRAM');

  // 5. Planejamento & Envio de Publicação
  await PublicationPlanner.createPlan({
    contentPackageId: contentPackageRes.package.id,
    channels: ['INSTAGRAM', 'TELEGRAM', 'OWN_WEBSITE'],
    targetCountries: ['BR', 'US'],
  });

  const worker = new PublicationWorker('seed_worker');
  await worker.processPendingQueue(50);

  // 6. Dados Analíticos & Financeiros DEMO (Módulo 7)
  const click = await prisma.analyticsClick.create({
    data: {
      trackingId: 'tr_seed_1001',
      destination: 'https://www.amazon.com.br/dp/B08N5WRWNW?tag=thomazpromos-20',
      channel: 'INSTAGRAM',
      country: 'BR',
      status: 'VALID',
      qualityScore: 100,
    },
  });

  const conversion = await prisma.analyticsConversion.create({
    data: {
      orderReference: 'ORD_SEED_9901',
      saleAmount: 749.0,
      commissionAmount: 67.41,
      currency: 'BRL',
      trackingId: click.trackingId,
      status: 'APPROVED',
    },
  });

  const sale = await prisma.saleRecord.create({
    data: {
      externalOrderId: 'ORD_SEED_9901',
      affiliateProgramId: amazon.id,
      productId: product.id,
      trackingId: click.trackingId,
      grossAmount: 749.0,
      netAmount: 749.0,
      commissionAmount: 67.41,
      status: 'CONFIRMED',
      reconciliationStatus: 'MATCHED',
    },
  });

  await prisma.commissionRecord.create({
    data: {
      saleId: sale.id,
      amount: 67.41,
      currency: 'BRL',
      status: 'APPROVED',
      approvedAt: new Date(),
    },
  });

  await prisma.costRecord.create({
    data: {
      costType: 'AI',
      source: 'OpenAI API',
      amount: 4.5,
      currency: 'BRL',
      description: 'Geração de textos de oferta via LLM',
    },
  });

  await AnalyticsPersistenceService.recordDailySummary(new Date(), 67.41, 4.5, 'BRL');

  console.log('✅ Seed do Módulo 7 concluído com sucesso! Registro financeiro com R$ 67.41 em comissões e R$ 4.50 em custos gravado.');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
