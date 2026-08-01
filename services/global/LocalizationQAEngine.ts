import { LocalizedContentPackage } from '../../types/global/localization.types';

export interface QAReport {
  qualityScore: number; // 0 to 100
  passed: boolean;
  issues: string[];
}

export class LocalizationQAEngine {
  public evaluateLocalizationQA(pkg: LocalizedContentPackage): QAReport {
    const issues: string[] = [];
    let score = 100;

    if (!pkg.translatedTitle || pkg.translatedTitle.length < 5) {
      score -= 30;
      issues.push('Title is missing or too short');
    }

    if (!pkg.translatedBody || pkg.translatedBody.length < 20) {
      score -= 30;
      issues.push('Body copy is missing or incomplete');
    }

    if (!pkg.affiliateDisclosure) {
      score -= 40;
      issues.push('CRITICAL: Mandatory affiliate disclosure is missing');
    }

    if (pkg.localizedPrice <= 0) {
      score -= 20;
      issues.push('Invalid localized price');
    }

    const finalScore = Math.max(0, score);
    const passed = finalScore >= 75 && !issues.some(i => i.includes('CRITICAL'));

    return {
      qualityScore: finalScore,
      passed,
      issues
    };
  }
}
