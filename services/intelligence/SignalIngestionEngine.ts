import { SignalEvent } from '../../types/intelligence/intelligence.types';

export class SignalIngestionEngine {
  /**
   * Sanitizes external raw text payload to prevent Prompt Injection attacks.
   * Wraps external text strictly into data blocks without executing system instructions.
   */
  public sanitizeExternalText(rawText: string): string {
    if (!rawText) return '';
    // Strip malicious instruction tags
    const sanitized = rawText
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<system\b[^<]*(?:(?!<\/system>)<[^<]*)*<\/system>/gi, '')
      .replace(/SYSTEM_PROMPT/gi, 'DATA_TEXT');

    return `<EXTERNAL_DATA>\n${sanitized.trim()}\n</EXTERNAL_DATA>`;
  }

  public ingestSignal(event: SignalEvent): SignalEvent {
    const sanitizedPayload = { ...event.payload };
    if (sanitizedPayload.rawText) {
      sanitizedPayload.rawText = this.sanitizeExternalText(sanitizedPayload.rawText);
    }

    return {
      ...event,
      id: event.id || `sig_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: event.timestamp || new Date(),
      payload: sanitizedPayload
    };
  }
}
