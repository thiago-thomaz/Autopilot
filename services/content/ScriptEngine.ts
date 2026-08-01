import { ScriptScene } from '../../types/content/content.types';

export class ScriptEngine {
  /**
   * Constrói roteiros de vídeo curto (0 a 30 segundos) divididos em 4 cenas.
   */
  public static buildShortVideoScript(title: string, currentPrice: number, rating?: number): ScriptScene[] {
    return [
      {
        sceneNumber: 1,
        timeRange: '0-5s',
        visualPrompt: `Close no produto ${title} em uso.`,
        narration: `Conheça o ${title}!`,
        textOnScreen: `R$ ${currentPrice.toFixed(2)}`,
      },
      {
        sceneNumber: 2,
        timeRange: '5-15s',
        visualPrompt: `Demonstração das características principais.`,
        narration: `Com nota ${rating || 4.5} estrelas de avaliação dos compradores.`,
        textOnScreen: `Nota ${rating || 4.5}/5 ⭐`,
      },
      {
        sceneNumber: 3,
        timeRange: '15-25s',
        visualPrompt: `Destaque para o acabamento e embalagem.`,
        narration: `Por apenas R$ ${currentPrice.toFixed(2)}, é uma excelente opção.`,
        textOnScreen: `Excelente Custo-Benefício!`,
      },
      {
        sceneNumber: 4,
        timeRange: '25-30s',
        visualPrompt: `Animação apontando para o link na bio.`,
        narration: `Confira o preço atualizado pelo link no perfil!`,
        textOnScreen: `Link na Bio!`,
      },
    ];
  }
}
