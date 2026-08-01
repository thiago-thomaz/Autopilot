/**
 * Contrato do Serviço de Compliance e Validação de Termos
 */

export interface ComplianceCheckResult {
  passed: boolean;
  ruleCode: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reason?: string;
}

export interface IComplianceService {
  validateContent(body: string, disclosure?: string): Promise<ComplianceCheckResult[]>;
  validatePublicationRules(channelPlatform: string, link: string): Promise<ComplianceCheckResult[]>;
}

export class ComplianceService implements IComplianceService {
  async validateContent(_body: string, disclosure?: string): Promise<ComplianceCheckResult[]> {
    const results: ComplianceCheckResult[] = [];

    // Verificação de aviso legal (#ad ou #afiliado)
    if (!disclosure || (!disclosure.includes('#ad') && !disclosure.includes('#afiliado'))) {
      results.push({
        passed: false,
        ruleCode: 'DISCLOSURE_REQUIRED',
        severity: 'HIGH',
        reason: 'Conteúdo de divulgação de afiliado exige sinalização clara (#ad ou #afiliado).',
      });
    } else {
      results.push({
        passed: true,
        ruleCode: 'DISCLOSURE_REQUIRED',
        severity: 'HIGH',
      });
    }

    return results;
  }

  async validatePublicationRules(_channelPlatform: string, _link: string): Promise<ComplianceCheckResult[]> {
    return [
      {
        passed: true,
        ruleCode: 'CHANNEL_ALLOWED',
        severity: 'LOW',
      },
    ];
  }
}
