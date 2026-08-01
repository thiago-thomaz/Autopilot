import { UnitConversionResult } from '../../types/global/localization.types';

export class MeasurementLocalizationEngine {
  /**
   * Converts unit specifications according to target market standards (US/UK vs Metric World)
   */
  public convertUnit(value: number, unit: string, targetCountry: string): UnitConversionResult {
    const isImperialTarget = targetCountry.toUpperCase() === 'US';
    const u = unit.toLowerCase().trim();

    // Weight conversions: kg -> lb
    if ((u === 'kg' || u === 'kilogram') && isImperialTarget) {
      return { originalValue: value, originalUnit: unit, convertedValue: Number((value * 2.20462).toFixed(1)), convertedUnit: 'lbs' };
    }
    if ((u === 'lb' || u === 'lbs' || u === 'pound') && !isImperialTarget) {
      return { originalValue: value, originalUnit: unit, convertedValue: Number((value / 2.20462).toFixed(1)), convertedUnit: 'kg' };
    }

    // Distance/Length: cm -> inch
    if ((u === 'cm' || u === 'centimeter') && isImperialTarget) {
      return { originalValue: value, originalUnit: unit, convertedValue: Number((value * 0.393701).toFixed(1)), convertedUnit: 'inches' };
    }

    // Temperature: C -> F
    if ((u === 'c' || u === 'celsius') && isImperialTarget) {
      return { originalValue: value, originalUnit: unit, convertedValue: Number(((value * 9) / 5 + 32).toFixed(0)), convertedUnit: '°F' };
    }

    return { originalValue: value, originalUnit: unit, convertedValue: value, convertedUnit: unit };
  }
}
