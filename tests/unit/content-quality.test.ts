import { describe, it, expect } from 'vitest';
import { ContentQualityService } from '../../services/content/ContentQualityService';

describe('ContentQualityService & Quality Gate', () => {
  it('deve atribuir Quality Score alto e Compliance Score 100 para conteúdo limpo e estruturado', () => {
    const mockOutput = {
      hook: 'Procurando por um Kindle Paperwhite?',
      title: 'Oferta Especial Kindle Paperwhite',
      caption: 'Legenda completa com todos os detalhes e especificações.',
      cta: 'Confira no link!',
      hashtags: ['#afiliado'],
      keywords: ['kindle'],
      script: [{ sceneNumber: 1, timeRange: '0-5s', visualPrompt: '...', narration: '...', textOnScreen: '...' }],
      affiliateDisclosure: '#afiliado #parceiro',
      modelUsed: 'MockLLM',
    };

    const res = ContentQualityService.calculateQualityScores(mockOutput, false);

    expect(res.qualityScore).toBeGreaterThanOrEqual(80);
    expect(res.complianceScore).toBe(100);
  });

  it('deve penalizar drasticamente o Quality e Compliance Score se houver alegações não suportadas', () => {
    const mockOutput = {
      hook: 'Ganhe dinheiro fácil!',
      title: 'Promoção Falsa',
      caption: 'Preço alterado',
      cta: 'Clique já!',
      hashtags: [],
      keywords: [],
      affiliateDisclosure: '',
      modelUsed: 'MockLLM',
    };

    const res = ContentQualityService.calculateQualityScores(mockOutput, true);

    expect(res.qualityScore).toBeLessThan(70);
    expect(res.complianceScore).toBeLessThan(90);
  });
});
