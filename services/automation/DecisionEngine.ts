import { MetricSnapshot, DecisionPayload, AutonomyLevel } from '../../types/automation/automation.types';
import { RuleEngine } from './RuleEngine';
import { DataSufficiencyEngine } from './DataSufficiencyEngine';
import { PriorityEngine } from './PriorityEngine';
import { ProductOptimizationEngine } from './ProductOptimizationEngine';
import { ChannelOptimizationEngine } from './ChannelOptimizationEngine';
import { CountryOptimizationEngine } from './CountryOptimizationEngine';

export class DecisionEngine {
  private ruleEngine: RuleEngine;
  private sufficiencyEngine: DataSufficiencyEngine;
  private priorityEngine: PriorityEngine;
  private productEngine: ProductOptimizationEngine;
  private channelEngine: ChannelOptimizationEngine;
  private countryEngine: CountryOptimizationEngine;

  constructor() {
    this.ruleEngine = new RuleEngine();
    this.sufficiencyEngine = new DataSufficiencyEngine();
    this.priorityEngine = new PriorityEngine();
    this.productEngine = new ProductOptimizationEngine();
    this.channelEngine = new ChannelOptimizationEngine();
    this.countryEngine = new CountryOptimizationEngine();
  }

  evaluateMetrics(metrics: MetricSnapshot, options?: { currentAutonomyLevel?: AutonomyLevel }): DecisionPayload[] {
    const candidateDecisions: DecisionPayload[] = [];

    // 1. Evaluate RuleEngine deterministic rules
    const ruleDecisions = this.ruleEngine.evaluateMetrics(metrics);
    candidateDecisions.push(...ruleDecisions);

    // 2. Evaluate domain specific engines
    const prodDec = this.productEngine.evaluateProduct('prod-1', metrics);
    if (prodDec) candidateDecisions.push(prodDec);

    const chanDec = this.channelEngine.evaluateChannel('INSTAGRAM', metrics);
    if (chanDec) candidateDecisions.push(chanDec);

    const countDec = this.countryEngine.evaluateCountry('US', metrics);
    if (countDec) candidateDecisions.push(countDec);

    // 3. Filter decisions against data sufficiency
    const filteredDecisions = candidateDecisions.filter((decision) => {
      const check = this.sufficiencyEngine.evaluate(metrics);
      if (!check.isSufficient && ['SCALE_WINNER', 'PAUSE', 'STOP_UNPROFITABLE', 'INCREASE_DISTRIBUTION'].includes(decision.decisionType)) {
        return false;
      }
      return true;
    });

    // 4. Rank using PriorityEngine
    return this.priorityEngine.rankDecisions(filteredDecisions);
  }
}
