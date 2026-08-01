import { VisualBrief } from '../../types/content/content.types';

export class VisualBriefEngine {
  /**
   * Constrói o briefing visual para geração de imagem/vídeo.
   */
  public static buildVisualBrief(title: string, channel: string): VisualBrief {
    const isVertical = channel === 'TIKTOK' || channel === 'YOUTUBE_SHORTS' || channel === 'INSTAGRAM';
    return {
      mainImageConcept: `Fotografia de produto em estúdio moderno destacando ${title}`,
      colorPalette: ['#10B981', '#1F2937', '#F59E0B'],
      compositionNotes: 'Produto centralizado com fundo limpo e espaço para sobreposição de texto.',
      aspectRatio: isVertical ? '9:16' : '1:1',
    };
  }
}
