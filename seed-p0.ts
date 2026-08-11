import { PrismaClient } from '@prisma/client';
import { SystemConfigService } from './services/core/SystemConfigService';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Configurando FASE 1 P0 ---');
  
  // Habilitar DRY RUN
  await SystemConfigService.setConfig('DRY_RUN', true, 'Modo simulação ativado para testes de tracking');
  console.log('DRY_RUN: true');

  // Habilitar Kill Switches
  await SystemConfigService.setConfig('AUTOPILOT_ENABLED', true, 'Global Autopilot enabled');
  console.log('AUTOPILOT_ENABLED: true');

  // Habilitar anti spam padrão
  await SystemConfigService.setConfig('ANTI_SPAM_CONFIG', {
    MAX_POSTS_PER_HOUR: 10,
    MAX_POSTS_PER_DAY: 100,
    MIN_SECONDS_BETWEEN_POSTS: 300,
    PRODUCT_COOLDOWN_MINUTES: 10080, // 7 days
    CATEGORY_COOLDOWN_MINUTES: 60,
    SELLER_COOLDOWN_MINUTES: 120,
    MARKETPLACE_COOLDOWN_MINUTES: 0
  }, 'Padrões de Anti-Spam');
  console.log('Anti-Spam configs created');

  console.log('Done.');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
