export interface CSuiteAdvice {
  role: 'CEO' | 'CFO' | 'COO' | 'CMO' | 'RISK_MANAGER';
  headline: string;
  recommendation: string;
  actionableSteps: string[];
  expectedImpact: string;
}

export class AutonomousBusinessAdvisor {
  public generateExecutiveAdvice(
    netProfit: number,
    profitMargin: number,
    cashBalance: number,
    minimumReserve: number,
    diversificationScore: number
  ): CSuiteAdvice[] {
    const adviceList: CSuiteAdvice[] = [];

    // CFO Advice
    if (cashBalance < minimumReserve) {
      adviceList.push({
        role: 'CFO',
        headline: 'CASH SAFETY LOCK WARNING: Preserve Liquidity',
        recommendation: `Cash balance ($${cashBalance}) is below the required reserve ($${minimumReserve}). Halt non-essential AI/Ad spend immediately.`,
        actionableSteps: [
          'Activate CASH_SAFETY_LOCK',
          'Pause experimental marketing channels',
          'Accelerate affiliate payout reconciliations'
        ],
        expectedImpact: 'Prevents operational cash deficit and protects business solvency.'
      });
    } else if (profitMargin >= 40) {
      adviceList.push({
        role: 'CFO',
        headline: 'High Operating Margin (40%+): Reinvest Cash',
        recommendation: `Net profit margin is healthy at ${profitMargin.toFixed(1)}%. Allocate 20% of net profits to international expansion.`,
        actionableSteps: [
          'Increase experimental budget by 15%',
          'Expand localization pipeline to Germany and US'
        ],
        expectedImpact: 'Accelerates top-line revenue growth without compromising liquidity.'
      });
    }

    // Risk Manager Advice
    if (diversificationScore < 50) {
      adviceList.push({
        role: 'RISK_MANAGER',
        headline: 'High Concentration Risk Identified',
        recommendation: `Diversification score is low (${diversificationScore}/100). More than 50% of revenue is concentrated in a single vector.`,
        actionableSteps: [
          'Diversify affiliate programs beyond primary provider',
          'Launch campaigns in secondary channel (Telegram/YouTube)'
        ],
        expectedImpact: 'Mitigates single point of failure risk from affiliate platform policy changes.'
      });
    }

    // CEO Advice
    adviceList.push({
      role: 'CEO',
      headline: 'Sustain Net Profit Growth',
      recommendation: `Maintain focus on Real Net Profit ($${netProfit.toFixed(2)}) over volume. Prioritize high-EPC product categories.`,
      actionableSteps: [
        'Review quarterly goal run rate weekly',
        'Enforce automated decision guardrails'
      ],
      expectedImpact: 'Sustains 25%+ YoY net profit compounding.'
    });

    return adviceList;
  }
}
