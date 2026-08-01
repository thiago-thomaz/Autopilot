export interface MasterContent {
  id: string;
  title: string;
  body: string;
  bullets: string[];
  cta: string;
}

export interface AtomizedContentPiece {
  format: 'INSTAGRAM_STORY' | 'TIKTOK_REEL' | 'X_TWEET' | 'TELEGRAM_ALERT' | 'PINTEREST_PIN';
  title: string;
  caption: string;
  cta: string;
  hashtags: string[];
}

export class ContentAtomizationEngine {
  public atomizeContent(master: MasterContent): AtomizedContentPiece[] {
    const hashtags = ['#promocao', '#desconto', '#ofertadodia', '#afiliado'];

    return [
      {
        format: 'INSTAGRAM_STORY',
        title: master.title.slice(0, 50),
        caption: `${master.title}\n\n${master.bullets.slice(0, 2).join('\n')}\n\n${master.cta}`,
        cta: master.cta,
        hashtags
      },
      {
        format: 'TIKTOK_REEL',
        title: `Confira essa oferta: ${master.title}`,
        caption: `${master.title} - ${master.cta}`,
        cta: master.cta,
        hashtags: [...hashtags, '#tiktokmademebuyit']
      },
      {
        format: 'X_TWEET',
        title: master.title,
        caption: `🚨 ${master.title.slice(0, 180)}...\n👉 ${master.cta}`,
        cta: master.cta,
        hashtags: ['#oferta']
      },
      {
        format: 'TELEGRAM_ALERT',
        title: `🔥 Oportunidade Imperdível: ${master.title}`,
        caption: `<b>${master.title}</b>\n\n${master.body.slice(0, 300)}\n\n👉 <b>${master.cta}</b>`,
        cta: master.cta,
        hashtags: []
      }
    ];
  }
}
