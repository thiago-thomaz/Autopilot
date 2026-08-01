import { LogLevel } from '@/types';

export interface LogEntry {
  level: LogLevel;
  module: string;
  event: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export class Logger {
  public static log(entry: LogEntry): void {
    const timestamp = new Date().toISOString();
    const formattedLog = `[${timestamp}] [${entry.level}] [${entry.module}] [${entry.event}]: ${entry.message}`;

    switch (entry.level) {
      case 'ERROR':
      case 'FATAL':
        console.error(formattedLog, entry.metadata || '');
        break;
      case 'WARN':
        console.warn(formattedLog, entry.metadata || '');
        break;
      default:
        console.log(formattedLog, entry.metadata || '');
        break;
    }
  }

  public static info(module: string, event: string, message: string, metadata?: Record<string, unknown>): void {
    this.log({ level: 'INFO', module, event, message, metadata });
  }

  public static error(module: string, event: string, message: string, metadata?: Record<string, unknown>): void {
    this.log({ level: 'ERROR', module, event, message, metadata });
  }

  public static warn(module: string, event: string, message: string, metadata?: Record<string, unknown>): void {
    this.log({ level: 'WARN', module, event, message, metadata });
  }
}
