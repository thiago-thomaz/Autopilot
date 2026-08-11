import { PrismaClient } from '@prisma/client';
import { WatchdogService } from '../../services/monitoring/WatchdogService';
import { AntiSpamEngine } from '../../services/core/AntiSpamEngine';
import { TrackingEngine } from '../../services/tracking/TrackingEngine';
import { SystemConfigService } from '../../services/core/SystemConfigService';
import { PublicationWorker } from '../../services/publication/PublicationWorker';

const prisma = new PrismaClient();

async function runValidations() {
  console.log('============================================');
  console.log(' P0 VALIDATION & HARDENING REPORT ');
  console.log('============================================');

  // 1. Verify Database
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('[PASS] DATABASE CONNECTIVITY: Prisma is connected.');
  } catch (error) {
    console.log('[FAIL] DATABASE CONNECTIVITY: Could not connect to DB.');
    console.error(error);
    return;
  }

  // 2. Test Kill Switch
  await SystemConfigService.setConfig('AUTOPILOT_ENABLED', false);
  const worker = new PublicationWorker();
  const killSwitchResult = await worker.processPendingQueue(1);
  if (killSwitchResult.errors && killSwitchResult.errors[0]?.message === 'AUTOPILOT_ENABLED=false') {
    console.log('[PASS] KILL SWITCH: Worker respects AUTOPILOT_ENABLED=false');
  } else {
    console.log('[FAIL] KILL SWITCH: Worker did not respect AUTOPILOT_ENABLED=false');
  }

  // 3. Test DRY RUN
  await SystemConfigService.setConfig('AUTOPILOT_ENABLED', true);
  await SystemConfigService.setConfig('DRY_RUN', true);
  // Re-enable dry run and push a mock queue item if possible.
  // We'd need to mock a full product/package structure here to run full E2E safely.
  console.log('[INFO] DRY RUN config successfully written to DB.');

  // 4. Test Anti-Spam
  console.log('\n--- ANTI-SPAM ENGINE ---');
  await SystemConfigService.setConfig('ANTI_SPAM_CONFIG', {
    MAX_POSTS_PER_HOUR: 10,
    MAX_POSTS_PER_DAY: 100,
    MIN_SECONDS_BETWEEN_POSTS: 1, // small for tests
    PRODUCT_COOLDOWN_MINUTES: 10080,
    CATEGORY_COOLDOWN_MINUTES: 60,
    SELLER_COOLDOWN_MINUTES: 120,
    MARKETPLACE_COOLDOWN_MINUTES: 0
  });

  const spamCheck = await AntiSpamEngine.isAllowedToPublish('test-prod-123', 'TELEGRAM', 'Smartphones', 'Apple');
  if (spamCheck.allowed) {
    console.log('[PASS] ANTI-SPAM: New product is allowed.');
  } else {
    console.log(`[FAIL] ANTI-SPAM: New product was blocked. Reason: ${spamCheck.reason}`);
  }

  // 5. Test Idempotency (Tracking)
  console.log('\n--- TRACKING & IDEMPOTENCY ---');
  // We create a mock publication in DB to test the redirect
  const mockProduct = await prisma.product.create({
    data: {
      externalId: 'test_product_1',
      affiliatePlatformId: 'amazon-brasil',
      title: 'Test Product',
      url: 'https://amazon.com.br/dp/test',
      status: 'APPROVED',
      currentPrice: 100,
      currency: 'BRL',
    }
  });

  const mockContent = await prisma.contentPackage.create({
    data: {
      productId: mockProduct.id,
      title: 'Mock Title',
      caption: 'Mock Caption',
      hook: '',
      cta: ''
    }
  });

  const mockPub = await prisma.publicationRecord.create({
    data: {
      productId: mockProduct.id,
      contentPackageId: mockContent.id,
      channel: 'TELEGRAM',
      status: 'PUBLISHED',
      trackingUrl: 'https://amazon.com.br/dp/test',
      idempotencyKey: 'test_key_123'
    }
  });

  try {
    const destUrl1 = await TrackingEngine.registerClickAndGetRedirect(mockPub.id, { ip: '127.0.0.1', userAgent: 'JestTest' });
    console.log('[PASS] TRACKING: First click registered successfully.');
    
    const clickCount = await prisma.clickEvent.count({ where: { publicationId: mockPub.id } });
    
    const destUrl2 = await TrackingEngine.registerClickAndGetRedirect(mockPub.id, { ip: '127.0.0.1', userAgent: 'JestTest' });
    const clickCount2 = await prisma.clickEvent.count({ where: { publicationId: mockPub.id } });

    if (clickCount === 1 && clickCount2 === 1) {
      console.log('[PASS] IDEMPOTENCY: Duplicate click within 10-minute window was correctly deduplicated.');
    } else {
      console.log('[FAIL] IDEMPOTENCY: Duplicate click was not deduplicated.');
    }

  } catch (error: any) {
    console.log(`[FAIL] TRACKING: ${error.message}`);
  }

  // 6. Test Watchdog
  console.log('\n--- WATCHDOG ---');
  const health = await WatchdogService.evaluateHealth();
  console.log(`[INFO] WATCHDOG STATE: ${health.state}`);
  console.log(`[INFO] WATCHDOG DETAILS:`, health.details);

  console.log('\n============================================');
  console.log(' END OF VALIDATION SCRIPT ');
  console.log('============================================');
  
}

runValidations()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
