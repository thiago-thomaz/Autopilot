export class MediaPreparationService {
  /**
   * Prepara os formatos de imagem e vídeo específicos para cada canal.
   */
  public static prepareMedia(mediaUrls: string[], channel: string): { formattedMedia: string[]; aspectRatio: string } {
    const isVertical = ['INSTAGRAM', 'TIKTOK', 'YOUTUBE_SHORTS'].includes(channel);
    return {
      formattedMedia: mediaUrls && mediaUrls.length > 0 ? mediaUrls : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'],
      aspectRatio: isVertical ? '9:16' : '1:1',
    };
  }
}
