/**
 * Autonomous Daemon Script
 * Permite a execução independente do motor autônomo nativo em segundo plano ou em contêiner de worker.
 */
import { InternalAutonomousEngine } from '../services/automation/InternalAutonomousEngine';
import { Logger } from '../lib/logger';

console.log('====================================================');
console.log('🤖 INICIANDO AUTONOMOUS ENGINE DAEMON (100% NATIVO) ');
console.log('====================================================');

const engine = InternalAutonomousEngine.getInstance();
const started = engine.start();

if (started) {
  Logger.info('DAEMON', 'BOOT_SUCCESS', 'Worker daemon autônomo iniciado com sucesso.');
} else {
  Logger.warn('DAEMON', 'BOOT_SKIPPED', 'Daemon não pôde ser iniciado ou já está ativo.');
}

const shutdown = () => {
  console.log('\n🛑 Recebido sinal de encerramento. Finalizando motor autônomo...');
  engine.stop();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
