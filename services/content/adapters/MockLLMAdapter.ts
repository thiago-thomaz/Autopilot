import { LLMProviderAdapter } from './LLMProviderAdapter';
import { LLMGenerationInput, GeneratedContentOutput } from '../../../types/content/content.types';

export class MockLLMAdapter implements LLMProviderAdapter {
  public providerName = 'MockLLM';

  public async generateContent(input: LLMGenerationInput): Promise<GeneratedContentOutput> {
    const discountText = input.previousPrice && input.previousPrice > input.currentPrice
      ? ` com desconto de R$ ${(input.previousPrice - input.currentPrice).toFixed(2)}`
      : '';

    const cleanedTitle = input.title
      .replace(/\[.*?\]/g, '')
      .replace(/-\s*Mercado\s*Livre/gi, '')
      .replace(/-\s*Amazon/gi, '')
      .trim();

    let hook = `Procurando por um ${cleanedTitle} com ótimo custo-benefício?`;
    let title = `Oferta Imperdível: ${cleanedTitle}`;
    let cta = 'Confira o preço e mais detalhes no link abaixo:';

    if (input.angle === 'DEAL') {
      hook = `🔥 Oportunidade: ${cleanedTitle}${discountText}!`;
      title = `Preço Especiais para ${cleanedTitle}`;
      cta = 'Aproveite o preço promocional acessando o link:';
    } else if (input.angle === 'PROBLEM_SOLUTION') {
      hook = `Diga adeus às complicações: conheça o ${cleanedTitle}.`;
      title = `Como o ${cleanedTitle} resolve o seu dia a dia`;
      cta = 'Veja como garantir o seu com segurança no link:';
    } else if (input.angle === 'COMPARISON') {
      hook = `Vale a pena investir no ${cleanedTitle}?`;
      title = `Análise de Valor: ${cleanedTitle}`;
      cta = 'Verifique a avaliação dos compradores no link:';
    }

    const prevPrice = input.previousPrice && input.previousPrice > input.currentPrice ? input.previousPrice : null;
    let priceSection = ``;
    if (prevPrice) {
      const discountPercent = Math.round(((prevPrice - input.currentPrice) / prevPrice) * 100);
      const discountString = discountPercent > 0 ? ` -${discountPercent}% OFF` : '';
      priceSection = `❌ De: R$ ${prevPrice.toFixed(2).replace('.', ',')}\n✅ Por: R$ ${input.currentPrice.toFixed(2).replace('.', ',')}${discountString}`;
    } else if (input.currentPrice > 0) {
      priceSection = `✅ Apenas: R$ ${input.currentPrice.toFixed(2).replace('.', ',')}`;
    } else {
      priceSection = `✅ Confira o preço atualizado no link abaixo!`;
    }
    
    let seller = 'Amazon';
    if (input.url && input.url.includes('mercadolivre')) seller = 'Mercado Livre';
    if (input.url && input.url.includes('shopee')) seller = 'Shopee';

    const caption = `💥 Olha isso! Oferta imperdível por tempo limitado!\n\n${cleanedTitle}\n\n${priceSection}\n\n🛒 Compre aqui: ${input.url}\n\n⚡ Quando acabar, acabou!\n\nVendido por ${seller}`;


    return {
      hook,
      title,
      subtitle: `Análise e detalhes sobre ${input.title}`,
      shortDescription: `Confira a oferta especial do ${input.title} por apenas R$ ${input.currentPrice.toFixed(2)}.`,
      longDescription: `O ${input.title} destaca-se pela sua qualidade, sendo uma excelente opção no segmento de ${input.category || 'produtos'}. Com nota ${input.rating || 4.5}/5 de satisfação, é a escolha ideal para quem busca economia e eficiência.`,
      bullets: [
        'Preço atrativo e competitivo',
        'Avaliações positivas de compradores',
        'Garantia oficial e suporte do fabricante',
      ],
      caption,
      cta,
      hashtags: ['#tecnologia', '#oferta', '#afiliado', '#compras'],
      keywords: [input.title, input.category || 'ofertas', 'desconto'],
      script: [
        {
          sceneNumber: 1,
          timeRange: '0-5s',
          visualPrompt: `Mostrar o produto ${input.title} em destaque em um ambiente moderno.`,
          narration: hook,
          textOnScreen: `R$ ${input.currentPrice.toFixed(2)}`,
        },
        {
          sceneNumber: 2,
          timeRange: '5-15s',
          visualPrompt: `Demonstração das principais funcionalidades do ${input.title}.`,
          narration: `Com nota ${input.rating || 4.5} estrelas, este modelo oferece altíssima qualidade.`,
          textOnScreen: `Nota ${input.rating || 4.5}/5 ⭐`,
        },
        {
          sceneNumber: 3,
          timeRange: '15-25s',
          visualPrompt: `Destaque para a caixa e selo de garantia oficial.`,
          narration: `Por apenas R$ ${input.currentPrice.toFixed(2)}, é um dos melhores custos-benefícios da categoria.`,
          textOnScreen: `Economia Garantida!`,
        },
        {
          sceneNumber: 4,
          timeRange: '25-30s',
          visualPrompt: `Animação direcionando para a bio ou botão do link.`,
          narration: cta,
          textOnScreen: `Link na bio / Descrição!`,
        },
      ],
      visualBrief: {
        mainImageConcept: `Foto profissional do ${input.title} sobre fundo limpo em contraste.`,
        colorPalette: ['#10B981', '#1F2937', '#F59E0B'],
        compositionNotes: 'Colocar o produto no centro com texto de preço em destaque no canto superior direito.',
        aspectRatio: input.channel === 'TIKTOK' || (input.channel as string) === 'YOUTUBE_SHORTS' || (input.channel as string) === 'YOUTUBE' ? '9:16' : '1:1',
      },
      affiliateDisclosure: 'Link de afiliado parceiro. Ao comprar por este link, podemos receber uma comissão sem custo adicional para você.',
      modelUsed: 'MockLLM-v1',
      tokensUsed: 150,
    };
  }
}
