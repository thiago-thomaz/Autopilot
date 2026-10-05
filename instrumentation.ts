/**
 * Next.js Instrumentation Hook
 * Inicializa nativamente o Motor Autônomo da aplicação sem depender de ferramentas externas como n8n.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { InternalAutonomousEngine } = await import('./services/automation/InternalAutonomousEngine');
    const { Logger } = await import('./lib/logger');

    Logger.info('SYSTEM_STARTUP', 'BOOTSTRAP_AUTONOMOUS', 'Inicializando subsistema autônomo nativo...');
    InternalAutonomousEngine.getInstance().start();
  }
}
