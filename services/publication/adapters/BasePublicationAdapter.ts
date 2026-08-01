import { OmnichannelChannel } from '@prisma/client';
import { PublicationPayload, PublicationResult } from '../../../types/publication/publication.types';

export abstract class BasePublicationAdapter {
  public abstract readonly channel: OmnichannelChannel;

  /**
   * Executa a publicação no canal.
   */
  public abstract publish(payload: PublicationPayload, accountId?: string): Promise<PublicationResult>;

  /**
   * Testa a conexão e credenciais com a plataforma.
   */
  public abstract testConnection(accountId?: string): Promise<{ success: boolean; message: string }>;
}
