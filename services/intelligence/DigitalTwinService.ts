import { IntelligenceContextState } from '../../types/intelligence/intelligence.types';

export class DigitalTwinService {
  private currentState: IntelligenceContextState | null = null;

  public updateState(state: IntelligenceContextState): void {
    this.currentState = state;
  }

  public getCurrentState(): IntelligenceContextState | null {
    return this.currentState;
  }
}
