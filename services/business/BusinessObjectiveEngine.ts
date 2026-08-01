import { BusinessObjectiveConfig } from '../../types/business/business.types';

export class BusinessObjectiveEngine {
  private objectives: Map<string, BusinessObjectiveConfig> = new Map();

  public createObjective(obj: BusinessObjectiveConfig): BusinessObjectiveConfig {
    const id = obj.id || `bobj_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newObj = { ...obj, id, currentValue: obj.currentValue || 0, status: obj.status || 'NOT_STARTED' };
    this.objectives.set(id, newObj);
    return newObj;
  }

  public getObjectives(): BusinessObjectiveConfig[] {
    return Array.from(this.objectives.values());
  }
}
