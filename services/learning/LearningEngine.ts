import { 
  LearningEventInput, 
  LearningEvent, 
  DiscoveredKnowledge, 
  RewardSignal, 
  FeedbackInput,
  CalibrationTargetModule,
  LearningQueuePriority
} from '../../types/learning/learning.types';
import { LearningNormalizer } from './LearningNormalizer';
import { LearningValidator } from './LearningValidator';
import { RewardEngine } from './RewardEngine';
import { FeedbackEngine } from './FeedbackEngine';
import { PatternEngine } from './PatternEngine';
import { RuleEngine } from './RuleEngine';
import { KnowledgeEngine } from './KnowledgeEngine';
import { Optimizer } from './Optimizer';
import { ModelRegistry } from './ModelRegistry';
import { KnowledgePublisher } from './KnowledgePublisher';

export interface ProcessedCycleSummary {
  eventsProcessed: number;
  knowledgeDiscovered: number;
  rulesExtracted: number;
  rewardsCalculated: number;
  calibrationsPerformed: number;
  durationMs: number;
}

export class LearningEngine {
  public normalizer: LearningNormalizer;
  public validator: LearningValidator;
  public rewardEngine: RewardEngine;
  public feedbackEngine: FeedbackEngine;
  public patternEngine: PatternEngine;
  public ruleEngine: RuleEngine;
  public knowledgeEngine: KnowledgeEngine;
  public optimizer: Optimizer;
  public modelRegistry: ModelRegistry;
  public publisher: KnowledgePublisher;

  private queues: Map<LearningQueuePriority, LearningEvent[]> = new Map([
    ['P0', []],
    ['P1', []],
    ['P2', []],
    ['P3', []],
    ['P4', []],
    ['HIGH', []],
    ['MEDIUM', []],
    ['LOW', []],
    ['BACKGROUND', []]
  ]);

  constructor() {
    this.normalizer = new LearningNormalizer();
    this.validator = new LearningValidator();
    this.rewardEngine = new RewardEngine();
    this.feedbackEngine = new FeedbackEngine();
    this.patternEngine = new PatternEngine();
    this.ruleEngine = new RuleEngine();
    this.knowledgeEngine = new KnowledgeEngine();
    this.optimizer = new Optimizer();
    this.modelRegistry = new ModelRegistry();
    this.publisher = new KnowledgePublisher();
  }

  /**
   * Ingests a new outcome or feedback event into the Learning Pipeline
   */
  public ingestEvent(input: LearningEventInput): LearningEvent {
    const normalized = this.normalizer.normalize(input);
    const validation = this.validator.validate(normalized);

    if (!validation.isValid || !validation.sanitizedEvent) {
      throw new Error(`Invalid LearningEvent: ${validation.errors.join('; ')}`);
    }

    const event = validation.sanitizedEvent;
    const priority = input.priority || 'MEDIUM';
    
    if (this.queues.has(priority)) {
      this.queues.get(priority)!.push(event);
    } else {
      this.queues.get('MEDIUM')!.push(event);
    }

    this.publisher.publishLearningEventReceived(event);
    this.publisher.publishLearningEventValidated(event);

    return event;
  }

  /**
   * Executes a full learning and knowledge extraction cycle over queued events
   */
  public processLearningCycle(): ProcessedCycleSummary {
    const startTime = Date.now();

    // Drain high to low priority queues
    const allEvents: LearningEvent[] = [];
    const priorities: LearningQueuePriority[] = ['P0', 'P1', 'HIGH', 'P2', 'MEDIUM', 'P3', 'LOW', 'P4', 'BACKGROUND'];

    for (const priority of priorities) {
      const q = this.queues.get(priority) || [];
      while (q.length > 0) {
        allEvents.push(q.shift()!);
      }
    }

    if (allEvents.length === 0) {
      return {
        eventsProcessed: 0,
        knowledgeDiscovered: 0,
        rulesExtracted: 0,
        rewardsCalculated: 0,
        calibrationsPerformed: 0,
        durationMs: Date.now() - startTime
      };
    }

    // 1. Calculate Rewards for decision outcomes
    const rewards: RewardSignal[] = [];
    for (const event of allEvents) {
      if (event.decisionId && typeof event.metrics.actualNetProfit === 'number') {
        const expectedProfit = typeof event.metrics.expectedNetProfit === 'number' ? event.metrics.expectedNetProfit : 0;
        const actualROI = typeof event.metrics.actualROI === 'number' ? event.metrics.actualROI : 1.0;
        const expectedROI = typeof event.metrics.expectedROI === 'number' ? event.metrics.expectedROI : 1.0;

        const reward = this.rewardEngine.calculateReward(
          event.decisionId,
          event.entityId,
          event.entityType,
          event.metrics.actualNetProfit,
          expectedProfit,
          actualROI,
          expectedROI
        );
        rewards.push(reward);
      }
    }

    // 2. Discover Patterns
    const patterns = this.patternEngine.discoverPatterns(allEvents);
    let knowledgeCount = 0;

    for (const pattern of patterns) {
      const item = this.knowledgeEngine.createKnowledge({
        knowledgeType: 'PATTERN',
        title: pattern.name,
        description: `Discovered pattern across ${pattern.clusterVariables.join(', ')} with lift ${pattern.performanceLiftRatio}x`,
        confidence: pattern.confidence,
        importance: Math.min(100, pattern.performanceLiftRatio * 50),
        sampleSize: pattern.sampleSize,
        evidence: { supportingEvents: pattern.supportingEvents, associatedMetric: pattern.associatedMetric }
      });
      this.publisher.publishKnowledgeDiscovered(item);
      knowledgeCount++;
    }

    // 3. Extract Rules
    const rules = this.ruleEngine.extractRulesFromEvents(allEvents);
    for (const rule of rules) {
      const item = this.knowledgeEngine.createKnowledge({
        knowledgeType: 'RULE',
        title: `Rule: IF ${JSON.stringify(rule.condition)} THEN ${rule.actionRecommendation}`,
        description: `Deterministic rule derived from ${rule.sampleSize} execution samples`,
        confidence: rule.confidence,
        importance: rule.confidence,
        sampleSize: rule.sampleSize,
        evidence: { supportingCount: rule.supportingCount, contradictingCount: rule.contradictingCount }
      });
      this.publisher.publishKnowledgeDiscovered(item);
      knowledgeCount++;
    }

    // 4. Meta-Optimization and Model Calibration Sockets
    const proposals = this.optimizer.optimizeHyperparameters(rewards);
    let calibrationCount = 0;

    for (const proposal of proposals) {
      const calibration = this.modelRegistry.recordCalibration(
        proposal.targetComponent,
        proposal.targetComponent.startsWith('M9') ? 'M9' : 'M13',
        proposal.previousValue,
        proposal.recommendedValue,
        proposal.reason
      );
      this.publisher.publishModelCalibrated(calibration);
      calibrationCount++;
    }

    const durationMs = Date.now() - startTime;
    const summary: ProcessedCycleSummary = {
      eventsProcessed: allEvents.length,
      knowledgeDiscovered: knowledgeCount,
      rulesExtracted: rules.length,
      rewardsCalculated: rewards.length,
      calibrationsPerformed: calibrationCount,
      durationMs
    };

    this.publisher.publishLearningCompleted(summary);
    return summary;
  }
}
