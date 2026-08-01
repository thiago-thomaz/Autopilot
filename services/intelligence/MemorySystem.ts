import { MemoryType } from '@prisma/client';
import { MemoryRecord, MemoryQueryFilter } from '../../types/intelligence/memory.types';

export class MemorySystem {
  private memories: Map<string, MemoryRecord> = new Map();

  public saveMemory(memory: MemoryRecord): MemoryRecord {
    const id = memory.id || `mem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const record: MemoryRecord = {
      ...memory,
      id,
      decayRate: memory.decayRate || 0.01,
      confidenceScore: memory.confidenceScore || 0.8,
      createdAt: memory.createdAt || new Date()
    };
    this.memories.set(id, record);
    return record;
  }

  public queryMemories(filter: MemoryQueryFilter): MemoryRecord[] {
    return Array.from(this.memories.values()).filter((m) => {
      if (filter.type && m.type !== filter.type) return false;
      if (filter.minConfidence && m.confidenceScore < filter.minConfidence) return false;
      if (filter.searchKey && !m.key.toLowerCase().includes(filter.searchKey.toLowerCase())) return false;
      return true;
    });
  }

  public applyDecay(): void {
    this.memories.forEach((m) => {
      m.confidenceScore = Math.max(0.1, Number((m.confidenceScore - (m.decayRate || 0.01)).toFixed(4)));
    });
  }
}
