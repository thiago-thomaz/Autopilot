/**
 * Contrato do Serviço de Notificações
 */

export interface SystemNotification {
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
}

export interface INotificationService {
  sendNotification(notification: SystemNotification): Promise<void>;
}

export class NotificationService implements INotificationService {
  async sendNotification(notification: SystemNotification): Promise<void> {
    console.log(`[NOTIFICATION] [${notification.type}] ${notification.title}: ${notification.message}`);
  }
}
