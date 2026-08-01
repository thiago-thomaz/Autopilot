import { LearningEvent, PatternResult } from '../../types/learning/learning.types';

export class PatternEngine {
  /**
   * Analyzes a set of learning events to discover statistical patterns
   * e.g., identifying high-ROI channel x country x angle combinations
   */
  public discoverPatterns(events: LearningEvent[]): PatternResult[] {
    if (!events || events.length === 0) return [];

    const patterns: PatternResult[] = [];
    const groupedByDimension: Map<string, LearningEvent[]> = new Map();

    // Group events by country + channel
    for (const event of events) {
      const key = `${event.country || 'ALL'}_${event.channel || 'ALL'}`;
      if (!groupedByDimension.has(key)) {
        groupedByDimension.set(key, []);
      }
      groupedByDimension.get(key)!.push(event);
    }

    let globalROISum = 0;
    let globalROICount = 0;

    for (const event of events) {
      if (typeof event.metrics.roi === 'number') {
        globalROISum += event.metrics.roi;
        globalROICount++;
      }
    }

    const baselineAvgROI = globalROICount > 0 ? globalROISum / globalROICount : 1.0;

    groupedByDimension.forEach((groupEvents, dimensionKey) => {
      if (groupEvents.length < 2) return; // Require at least 2 events for statistical pattern

      let groupROISum = 0;
      let count = 0;
      const supportingIds: string[] = [];

      for (const e of groupEvents) {
        if (typeof e.metrics.roi === 'number') {
          groupROISum += e.metrics.roi;
          count++;
          supportingIds.push(e.id);
        }
      }

      if (count === 0) return;

      const groupAvgROI = groupROISum / count;
      const liftRatio = baselineAvgROI !== 0 ? groupAvgROI / baselineAvgROI : 1.0;

      // Only flag meaningful patterns with lift > 1.15 or drop < 0.85
      if (liftRatio >= 1.15 || liftRatio <= 0.85) {
        const [country, channel] = dimensionKey.split('_');
        const confidence = Math.min(95, Math.max(50, 50 + count * 5));

        patterns.push({
          patternId: `pat_${dimensionKey}_${Date.now()}`,
          name: `Pattern [${country}/${channel}]: ${liftRatio >= 1.15 ? 'HIGH_PERFORMER' : 'UNDERPERFORMER'}`,
          clusterVariables: ['country', 'channel'],
          associatedMetric: 'ROI',
          performanceLiftRatio: Number(liftRatio.toFixed(4)),
          confidence: Number(confidence.toFixed(2)),
          sampleSize: count,
          supportingEvents: supportingIds
        });
      }
    });

    return patterns;
  }
}
