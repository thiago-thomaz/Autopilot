import { OmnichannelChannel } from '@prisma/client';

export interface TargetAccount {
  accountId: string;
  channel: OmnichannelChannel;
}

export class ChannelRouterService {
  /**
   * Mapeia categorias para grupos/canais específicos.
   */
  public static getTargetAccounts(category: string, channel: OmnichannelChannel): TargetAccount[] {
    const cat = (category || '').toLowerCase();
    
    // Regras de Roteamento (Hardcoded para Fase P4)
    if (channel === 'WHATSAPP') {
      if (cat.includes('eletronico') || cat.includes('informatica') || cat.includes('celular')) {
        return [
          { accountId: 'whatsapp-tech-group', channel },
          { accountId: 'whatsapp-geral-group', channel }
        ];
      }
      return [{ accountId: 'whatsapp-geral-group', channel }];
    }

    if (channel === 'TELEGRAM') {
      if (cat.includes('casa') || cat.includes('cozinha')) {
        return [
          { accountId: 'telegram-casa-channel', channel },
          { accountId: 'telegram-geral-channel', channel }
        ];
      }
      return [{ accountId: 'telegram-geral-channel', channel }];
    }

    // Default: envia sem accountId específico, usando o default do adapter
    return [{ accountId: 'default', channel }];
  }
}
