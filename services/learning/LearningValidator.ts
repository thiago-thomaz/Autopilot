import { LearningEvent } from '../../types/learning/learning.types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedEvent?: LearningEvent;
}

export class LearningValidator {
  private processedEventIds: Set<string> = new Set();

  public validate(event: LearningEvent): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Idempotency check
    if (this.processedEventIds.has(event.id)) {
      errors.push(`Duplicate event ID detected: ${event.id}`);
      return { isValid: false, errors, warnings };
    }

    if (!event.source || event.source.trim() === '') {
      errors.push('Learning event source is required.');
    }

    if (!event.entityType || event.entityType.trim() === '') {
      errors.push('Learning event entityType is required.');
    }

    if (!event.entityId || event.entityId.trim() === '') {
      errors.push('Learning event entityId is required.');
    }

    if (!event.metrics || typeof event.metrics !== 'object') {
      errors.push('Learning event metrics must be a valid object.');
    }

    if (event.confidenceScore < 0 || event.confidenceScore > 1) {
      warnings.push(`Confidence score out of bounds [0, 1]: ${event.confidenceScore}. Clamping score.`);
    }

    if (event.qualityScore < 0 || event.qualityScore > 1) {
      warnings.push(`Quality score out of bounds [0, 1]: ${event.qualityScore}. Clamping score.`);
    }

    const isValid = errors.length === 0;

    const sanitizedEvent: LearningEvent = {
      ...event,
      confidenceScore: Math.max(0, Math.min(1, event.confidenceScore)),
      qualityScore: Math.max(0, Math.min(1, event.qualityScore)),
      status: isValid ? 'VALIDATED' : 'REJECTED'
    };

    if (isValid) {
      this.processedEventIds.add(event.id);
    }

    return {
      isValid,
      errors,
      warnings,
      sanitizedEvent
    };
  }

  public clearCache(): void {
    this.processedEventIds.clear();
  }
}
