export interface ApprovalItem {
  id: string;
  type: 'CAMPAIGN_PROPOSAL' | 'BUDGET_REALLOCATION' | 'KILL_SWITCH' | 'SCALE_HIGH_RISK';
  title: string;
  description: string;
  proposedBy: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  payload: any;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  rejectionReason?: string;
}

export class ApprovalEngine {
  private items: Map<string, ApprovalItem> = new Map();

  public createRequest(
    type: ApprovalItem['type'],
    title: string,
    description: string,
    riskLevel: ApprovalItem['riskLevel'],
    payload: any
  ): ApprovalItem {
    const id = `appr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const item: ApprovalItem = {
      id,
      type,
      title,
      description,
      proposedBy: 'GrowthEngine',
      riskLevel,
      payload,
      status: 'PENDING',
      createdAt: new Date()
    };
    this.items.set(id, item);
    return item;
  }

  public approve(id: string, operator: string = 'HumanOperator'): ApprovalItem {
    const item = this.items.get(id);
    if (!item) throw new Error(`Approval request ${id} not found`);

    item.status = 'APPROVED';
    item.resolvedAt = new Date();
    item.resolvedBy = operator;
    return item;
  }

  public reject(id: string, reason: string, operator: string = 'HumanOperator'): ApprovalItem {
    const item = this.items.get(id);
    if (!item) throw new Error(`Approval request ${id} not found`);

    item.status = 'REJECTED';
    item.resolvedAt = new Date();
    item.resolvedBy = operator;
    item.rejectionReason = reason;
    return item;
  }

  public getPending(): ApprovalItem[] {
    return Array.from(this.items.values()).filter((i) => i.status === 'PENDING');
  }

  public getById(id: string): ApprovalItem | null {
    return this.items.get(id) || null;
  }
}
