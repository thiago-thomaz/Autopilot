import { MemoryType } from '@prisma/client';

export interface MemoryRecord {
  id?: string;
  type: MemoryType; // EPISODIC, SEMANTIC, STRATEGIC, PROCEDURAL, WORKING
  key: string;
  content: Record<string, any>;
  confidenceScore: number;
  decayRate?: number;
  validUntil?: Date | string;
  tags?: string[];
  createdAt?: Date | string;
}

export interface MemoryQueryFilter {
  type?: MemoryType;
  minConfidence?: number;
  tag?: string;
  searchKey?: string;
}
