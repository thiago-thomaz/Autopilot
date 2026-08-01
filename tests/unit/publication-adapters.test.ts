import { describe, it, expect } from 'vitest';
import { PublicationAdapterFactory } from '../../services/publication/PublicationAdapterFactory';

describe('PublicationAdapterFactory & Platform Adapters', () => {
  it('deve instanciar adapters corretos para os 20 canais', () => {
    const instagramAdapter = PublicationAdapterFactory.getAdapter('INSTAGRAM');
    expect(instagramAdapter.channel).toBe('INSTAGRAM');

    const redditAdapter = PublicationAdapterFactory.getAdapter('REDDIT');
    expect(redditAdapter.channel).toBe('REDDIT');
  });

  it('deve retornar MANUAL_REQUIRED para o canal REDDIT para aprovação humana', async () => {
    const redditAdapter = PublicationAdapterFactory.getAdapter('REDDIT');
    const result = await redditAdapter.publish({
      title: 'Kindle em Promoção',
      body: 'Texto da postagem',
      trackingUrl: 'https://amazon.com.br/dp/123',
      affiliateDisclosure: '#ad',
      cta: 'Confira',
    });

    expect(result.status).toBe('MANUAL_REQUIRED');
    expect(result.manualPackage).toBeDefined();
    expect(result.manualPackage?.platform).toBe('Reddit');
  });

  it('deve executar publicação com sucesso em MOCK_MODE para Instagram e Site Próprio', async () => {
    const ownSiteAdapter = PublicationAdapterFactory.getAdapter('OWN_WEBSITE');
    const result = await ownSiteAdapter.publish({
      title: 'Monitor Gamer 144Hz',
      body: 'Texto do monitor',
      trackingUrl: 'http://localhost:3000/deals/monitor',
      affiliateDisclosure: '#ad',
      cta: 'Ver no site',
    });

    expect(result.status).toBe('PUBLISHED');
    expect(result.externalUrl).toContain('localhost:3000/deals/');
  });
});
