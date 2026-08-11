import { Logger } from '../../lib/logger';

// In-memory store for basic rate limiting against bot floods
const ipHits = new Map<string, { count: number; timestamp: number }>();

export class ClickRateLimiter {
  private static readonly MAX_REQUESTS_PER_MINUTE = 20;
  private static readonly WINDOW_MS = 60 * 1000;

  /**
   * Checks if an IP has exceeded the allowed click rate.
   * Returns true if allowed, false if blocked.
   */
  static isAllowed(ip: string): boolean {
    if (!ip || ip === 'unknown') return true; // Cannot reliably block unknown IPs

    const now = Date.now();
    const record = ipHits.get(ip);

    if (!record) {
      ipHits.set(ip, { count: 1, timestamp: now });
      this.cleanup();
      return true;
    }

    if (now - record.timestamp > this.WINDOW_MS) {
      // Reset window
      ipHits.set(ip, { count: 1, timestamp: now });
      return true;
    }

    record.count += 1;
    if (record.count > this.MAX_REQUESTS_PER_MINUTE) {
      Logger.warn('RATE_LIMIT', 'IP_BLOCKED', `IP ${ip} blocked due to excessive clicks (${record.count} req/min)`);
      return false;
    }

    return true;
  }

  /**
   * Periodically cleans up the memory map to prevent memory leaks.
   */
  private static cleanup() {
    // Basic cleanup: if size gets too big, clear old entries
    if (ipHits.size > 1000) {
      const now = Date.now();
      for (const [key, record] of ipHits.entries()) {
        if (now - record.timestamp > this.WINDOW_MS) {
          ipHits.delete(key);
        }
      }
    }
  }
}
