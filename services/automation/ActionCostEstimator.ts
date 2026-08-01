import { CostEstimate, ActionType } from '../../types/automation/automation.types';

export class ActionCostEstimator {
  private apiUnitCost = 0.001; // $0.001 per API call
  private aiGenerationCost = 0.05; // $0.05 per AI task
  private messagingCost = 0.01; // $0.01 per message

  estimateCost(actionType: ActionType, payload?: Record<string, any>): CostEstimate {
    let apiCost = 0;
    let aiCost = 0;
    let msgCost = 0;

    switch (actionType) {
      case 'CREATE_CONTENT_TASK':
      case 'CHANGE_CONTENT_VARIANT':
        aiCost = this.aiGenerationCost * (payload?.count || 1);
        apiCost = this.apiUnitCost * 2;
        break;

      case 'CREATE_PUBLICATION_TASK':
      case 'UPDATE_SCHEDULE':
        apiCost = this.apiUnitCost * 3;
        break;

      case 'SEND_ALERT':
      case 'SEND_REPORT':
        msgCost = this.messagingCost * (payload?.recipientCount || 1);
        apiCost = this.apiUnitCost;
        break;

      case 'CREATE_EXPERIMENT':
        aiCost = this.aiGenerationCost * 2;
        apiCost = this.apiUnitCost * 5;
        break;

      default:
        apiCost = this.apiUnitCost;
        break;
    }

    const totalCost = Number((apiCost + aiCost + msgCost).toFixed(4));
    return {
      apiCost,
      aiCost,
      messagingCost: msgCost,
      totalCost,
      currency: 'USD',
    };
  }
}
