import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ContentChannelAdapter } from '@/services/content/adapters/ContentChannelAdapter';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pkg = await prisma.contentPackage.findUnique({
      where: { id: params.id },
    });

    if (!pkg) {
      return NextResponse.json({ success: false, error: 'Pacote não encontrado.' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const channel = (searchParams.get('channel') as any) || pkg.channel;

    const preview = ContentChannelAdapter.formatPreview(
      {
        hook: pkg.hook,
        title: pkg.title,
        subtitle: pkg.subtitle || undefined,
        shortDescription: pkg.shortDescription || undefined,
        longDescription: pkg.longDescription || undefined,
        bullets: (pkg.bullets as any) || [],
        caption: pkg.caption,
        cta: pkg.cta,
        hashtags: (pkg.hashtags as any) || [],
        keywords: (pkg.keywords as any) || [],
        script: (pkg.script as any) || [],
        visualBrief: (pkg.visualBrief as any) || undefined,
        affiliateDisclosure: pkg.affiliateDisclosure || '',
        modelUsed: 'ContentEngine',
      },
      channel
    );

    return NextResponse.json({ success: true, channel, preview });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
