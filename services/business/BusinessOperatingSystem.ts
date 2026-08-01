import { TrueBusinessProfitEngine } from './TrueBusinessProfitEngine';
import { GoalGapEngine } from './GoalGapEngine';
import { CashFlowEngine } from './CashFlowEngine';
import { CashReserveManager } from './CashReserveManager';
import { ExpenseManager } from './ExpenseManager';
import { CostEfficiencyEngine } from './CostEfficiencyEngine';
import { AICostController } from './AICostController';
import { BusinessPortfolioEngine } from './BusinessPortfolioEngine';
import { PortfolioRebalancingEngine } from './PortfolioRebalancingEngine';
import { BusinessRiskEngine } from './BusinessRiskEngine';
import { BusinessContinuityEngine } from './BusinessContinuityEngine';
import { AffiliateLinkHealthEngine } from './AffiliateLinkHealthEngine';
import { BusinessDiagnosticEngine } from './BusinessDiagnosticEngine';
import { BusinessRootCauseEngine } from './BusinessRootCauseEngine';
import { BusinessForecastEngine } from './BusinessForecastEngine';
import { BusinessSimulationEngine } from './BusinessSimulationEngine';
import { ResourcePlanningEngine } from './ResourcePlanningEngine';
import { AutonomousBusinessAdvisor } from './AutonomousBusinessAdvisor';
import { BusinessMemoryService } from './BusinessMemoryService';
import { BusinessExperimentEngine } from './BusinessExperimentEngine';
import { TradeoffEngine } from './TradeoffEngine';
import { FinancialReconciliationEngine } from './FinancialReconciliationEngine';
import { AffiliatePayoutTracker } from './AffiliatePayoutTracker';
import { ExecutiveReportEngine } from './ExecutiveReportEngine';
import { BusinessAlertEngine } from './BusinessAlertEngine';
import { BusinessDataQualityEngine } from './BusinessDataQualityEngine';
import { BusinessProfileService } from './BusinessProfileService';
import { BusinessObjectiveEngine } from './BusinessObjectiveEngine';
import { BusinessStrategyEngine } from './BusinessStrategyEngine';
import { StrategicPriorityEngine } from './StrategicPriorityEngine';
import { QuarterlyPlanningEngine } from './QuarterlyPlanningEngine';
import { BusinessPersistenceService } from './BusinessPersistenceService';
import { BusinessAutomationMode } from '../../types/business/business.types';

export interface BusinessOSCycleResult {
  timestamp: Date;
  status: 'SUCCESS' | 'SAFETY_LOCK' | 'KILL_SWITCH';
  mode: BusinessAutomationMode;
  executiveDRE: any;
  diagnostic: any;
  advice: any[];
  rebalanceRecommendations: any[];
  alerts: any[];
}

export class BusinessOperatingSystem {
  public profileService = new BusinessProfileService();
  public objectiveEngine = new BusinessObjectiveEngine();
  public strategyEngine = new BusinessStrategyEngine();
  public priorityEngine = new StrategicPriorityEngine();
  public quarterlyEngine = new QuarterlyPlanningEngine();
  public dreEngine = new TrueBusinessProfitEngine();
  public goalGapEngine = new GoalGapEngine();
  public cashFlowEngine = new CashFlowEngine();
  public cashReserveManager = new CashReserveManager();
  public expenseManager = new ExpenseManager();
  public costEfficiencyEngine = new CostEfficiencyEngine();
  public aiCostController = new AICostController();
  public portfolioEngine = new BusinessPortfolioEngine();
  public rebalancingEngine = new PortfolioRebalancingEngine();
  public riskEngine = new BusinessRiskEngine();
  public continuityEngine = new BusinessContinuityEngine();
  public linkHealthEngine = new AffiliateLinkHealthEngine();
  public diagnosticEngine = new BusinessDiagnosticEngine();
  public rootCauseEngine = new BusinessRootCauseEngine();
  public forecastEngine = new BusinessForecastEngine();
  public simulationEngine = new BusinessSimulationEngine();
  public resourceEngine = new ResourcePlanningEngine();
  public advisor = new AutonomousBusinessAdvisor();
  public memoryService = new BusinessMemoryService();
  public experimentEngine = new BusinessExperimentEngine();
  public tradeoffEngine = new TradeoffEngine();
  public reconciliationEngine = new FinancialReconciliationEngine();
  public payoutTracker = new AffiliatePayoutTracker();
  public reportEngine = new ExecutiveReportEngine();
  public alertEngine = new BusinessAlertEngine();
  public dataQualityEngine = new BusinessDataQualityEngine();
  public persistence = new BusinessPersistenceService();

  public shadowMode: boolean = true;
  public mode: BusinessAutomationMode = 'SUPERVISED';
  public globalKillSwitch: boolean = false;

  public setGlobalKillSwitch(active: boolean): void {
    this.globalKillSwitch = active;
  }

  /**
   * Executes one iteration of the Business OS Executive Cycle:
   * GOALS -> STRATEGY -> PLAN -> RESOURCES -> EXECUTION -> MEASUREMENT -> DIAGNOSIS -> LEARNING -> REBALANCE -> FORECAST -> REPLAN
   */
  public runExecutiveCycle(financialInput: any = {}): BusinessOSCycleResult {
    if (this.globalKillSwitch) {
      this.alertEngine.dispatchAlert('GLOBAL_BUSINESS_KILL_SWITCH', 'Global Business Kill Switch is ACTIVE', 'CRITICAL');
      return {
        timestamp: new Date(),
        status: 'KILL_SWITCH',
        mode: this.mode,
        executiveDRE: null,
        diagnostic: null,
        advice: [],
        rebalanceRecommendations: [],
        alerts: this.alertEngine.getActiveAlerts()
      };
    }

    // 1. Executive DRE Calculation
    const dre = this.dreEngine.generateExecutiveDRE({
      commissionRevenue: financialInput.commissionRevenue || 15000,
      refunds: financialInput.refunds || 200,
      reversals: financialInput.reversals || 100,
      aiCosts: financialInput.aiCosts || 300,
      infrastructureCosts: financialInput.infrastructureCosts || 500,
      currency: 'USD'
    });

    // 2. Cash Reserve Safety Check
    const cashReserveConfig = this.cashReserveManager.updateBalance(financialInput.cashBalance || 5000);

    if (cashReserveConfig.status === 'SAFETY_LOCK') {
      this.alertEngine.dispatchAlert('CASH_SAFETY_LOCK', 'Cash balance dipped below minimum reserve threshold. SAFETY LOCK ACTIVATED.', 'CRITICAL');
    }

    // 3. Portfolio & Concentration Analysis
    const divAnalysis = this.portfolioEngine.analyzeDiversification({
      productShare: financialInput.productShare || { prodA: 60, prodB: 40 },
      marketShare: financialInput.marketShare || { US: 70, BR: 30 },
      channelShare: financialInput.channelShare || { INSTAGRAM: 50, TELEGRAM: 50 },
      affiliateProgramShare: financialInput.affiliateProgramShare || { amazon: 80 }
    });

    if (divAnalysis.hasConcentrationRisk) {
      this.alertEngine.dispatchAlert('CONCENTRATION_RISK', `Concentration risk detected: Highest factor is ${divAnalysis.highestRiskFactor}`, 'WARNING');
    }

    // 4. Rebalance Recommendations
    const rebalanceRecommendations = this.rebalancingEngine.generateRebalancePlan(divAnalysis);

    // 5. Overall Health Diagnostic
    const diagnostic = this.diagnosticEngine.generateDiagnosticReport(
      dre.netProfit,
      dre.roi,
      divAnalysis.diversificationScore,
      cashReserveConfig.currentBalance,
      cashReserveConfig.minimumCashReserve
    );

    // 6. Natural Language C-Suite Executive Advice
    const advice = this.advisor.generateExecutiveAdvice(
      dre.netProfit,
      dre.profitMargin,
      cashReserveConfig.currentBalance,
      cashReserveConfig.minimumCashReserve,
      divAnalysis.diversificationScore
    );

    return {
      timestamp: new Date(),
      status: cashReserveConfig.status === 'SAFETY_LOCK' ? 'SAFETY_LOCK' : 'SUCCESS',
      mode: this.mode,
      executiveDRE: dre,
      diagnostic,
      advice,
      rebalanceRecommendations,
      alerts: this.alertEngine.getActiveAlerts()
    };
  }
}
