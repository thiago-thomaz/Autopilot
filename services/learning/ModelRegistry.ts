import { ModelCalibrationRecord, CalibrationTargetModule } from '../../types/learning/learning.types';

export class ModelRegistry {
  private records: ModelCalibrationRecord[] = [];

  public recordCalibration(
    modelId: string,
    targetModule: CalibrationTargetModule,
    previousMetric: number,
    calibratedMetric: number,
    reason?: string
  ): ModelCalibrationRecord {
    const previous = Number(previousMetric.toFixed(4));
    const calibrated = Number(calibratedMetric.toFixed(4));
    const adjustmentFactor = previous !== 0 
      ? Number((calibrated / previous).toFixed(4)) 
      : 1.0;

    const record: ModelCalibrationRecord = {
      id: `cal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      modelId,
      targetModule,
      previousMetric: previous,
      calibratedMetric: calibrated,
      adjustmentFactor,
      reason: reason || 'Routine M14 Model Calibration',
      appliedAt: new Date().toISOString()
    };

    this.records.push(record);
    return record;
  }

  public getCalibrationHistory(modelId?: string): ModelCalibrationRecord[] {
    if (!modelId) return [...this.records];
    return this.records.filter(r => r.modelId === modelId);
  }

  public getLatestCalibration(modelId: string): ModelCalibrationRecord | undefined {
    const history = this.getCalibrationHistory(modelId);
    if (history.length === 0) return undefined;
    return history[history.length - 1];
  }
}
