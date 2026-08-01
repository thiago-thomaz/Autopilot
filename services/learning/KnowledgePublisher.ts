import { DiscoveredKnowledge, ModelCalibrationRecord, LearningEvent } from '../../types/learning/learning.types';

export type EventBusSubscriber = (eventType: string, payload: any) => void;

export class KnowledgePublisher {
  private subscribers: Map<string, EventBusSubscriber[]> = new Map();

  public subscribe(eventType: string, handler: EventBusSubscriber): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push(handler);
  }

  public publish(eventType: string, payload: any): void {
    const handlers = this.subscribers.get(eventType) || [];
    const wildcardHandlers = this.subscribers.get('*') || [];

    [...handlers, ...wildcardHandlers].forEach(handler => {
      try {
        handler(eventType, payload);
      } catch (err) {
        console.error(`Error in event handler for ${eventType}:`, err);
      }
    });
  }

  public publishLearningEventReceived(event: LearningEvent): void {
    this.publish('learning.event.received', { event, timestamp: new Date().toISOString() });
  }

  public publishLearningEventValidated(event: LearningEvent): void {
    this.publish('learning.event.validated', { event, timestamp: new Date().toISOString() });
  }

  public publishKnowledgeDiscovered(knowledge: DiscoveredKnowledge): void {
    this.publish('knowledge.published', { knowledge, timestamp: new Date().toISOString() });
  }

  public publishModelCalibrated(calibration: ModelCalibrationRecord): void {
    this.publish('model.calibrated', { calibration, timestamp: new Date().toISOString() });
  }

  public publishLearningCompleted(summary: Record<string, any>): void {
    this.publish('learning.completed', { summary, timestamp: new Date().toISOString() });
  }
}
