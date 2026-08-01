export interface JournalEntry {
  id?: string;
  decisionId: string;
  title: string;
  whyReasoning: string;
  evaluatedRisks: any;
  agentOpinions: any;
  actualOutcome?: any;
  createdAt: Date | string;
}

export class DecisionJournal {
  private entries: Map<string, JournalEntry> = new Map();

  public recordEntry(entry: JournalEntry): JournalEntry {
    const id = entry.id || `jour_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const record = { ...entry, id, createdAt: entry.createdAt || new Date() };
    this.entries.set(id, record);
    return record;
  }

  public getJournalByDecision(decisionId: string): JournalEntry | undefined {
    return Array.from(this.entries.values()).find((e) => e.decisionId === decisionId);
  }

  public getAllEntries(): JournalEntry[] {
    return Array.from(this.entries.values());
  }
}
