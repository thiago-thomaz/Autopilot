export type TaskComplexity = 'SIMPLE' | 'MEDIUM' | 'COMPLEX' | 'CRITICAL';

export class ModelRouter {
  public selectModel(complexity: TaskComplexity): string {
    switch (complexity) {
      case 'CRITICAL':
        return 'gemini-1.5-pro';
      case 'COMPLEX':
        return 'gemini-1.5-pro';
      case 'MEDIUM':
        return 'gemini-1.5-flash';
      case 'SIMPLE':
      default:
        return 'gemini-1.5-flash';
    }
  }
}
