export interface OriginalContentAsset {
  id: string;
  sourceChannel: string;
  originalText: string;
  originalHeadline: string;
  performanceScore: number;
}

export interface RepurposedContentAsset {
  targetChannel: string;
  repurposedHeadline: string;
  repurposedText: string;
  adaptedAngle: string;
}

export class ContentRepurposingEngine {
  public repurposeForChannel(
    asset: OriginalContentAsset,
    targetChannel: string
  ): RepurposedContentAsset {
    let adaptedAngle = 'DEAL';
    let text = asset.originalText;

    if (targetChannel.toUpperCase() === 'BLOG') {
      adaptedAngle = 'REVIEW';
      text = `# Análise Completa: ${asset.originalHeadline}\n\n${asset.originalText}\n\n## Vale a pena? \nConfira os detalhes e onde encontrar pelo melhor preço.`;
    } else if (targetChannel.toUpperCase() === 'EMAIL') {
      adaptedAngle = 'PROBLEM_SOLUTION';
      text = `Olá!\n\nVocê já viu essa novidade?\n${asset.originalText}\n\nAproveite antes que o estoque acabe.`;
    }

    return {
      targetChannel,
      repurposedHeadline: asset.originalHeadline,
      repurposedText: text,
      adaptedAngle
    };
  }
}
