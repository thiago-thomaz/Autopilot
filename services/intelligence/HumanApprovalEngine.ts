import { ApprovalChannelType } from '@prisma/client';

export interface HumanApprovalRecord {
  id?: string;
  decisionId: string;
  requestedBy: string;
  channel: ApprovalChannelType;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  responseNote?: string;
  respondedAt?: Date | string;
}

export class HumanApprovalEngine {
  private requests: Map<string, HumanApprovalRecord> = new Map();

  public createApprovalRequest(decisionId: string, channel: ApprovalChannelType = 'DASHBOARD'): HumanApprovalRecord {
    const id = `appr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const record: HumanApprovalRecord = {
      id,
      decisionId,
      requestedBy: 'SYSTEM',
      channel,
      status: 'PENDING'
    };
    this.requests.set(id, record);
    return record;
  }

  public respondToApproval(id: string, approved: boolean, note?: string): HumanApprovalRecord {
    const req = this.requests.get(id);
    if (!req) throw new Error(`Approval request ${id} not found`);

    req.status = approved ? 'APPROVED' : 'REJECTED';
    req.responseNote = note;
    req.respondedAt = new Date();
    return req;
  }

  public getPendingRequests(): HumanApprovalRecord[] {
    return Array.from(this.requests.values()).filter((r) => r.status === 'PENDING');
  }
}
