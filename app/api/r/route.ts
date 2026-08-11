import { NextRequest, NextResponse } from 'next/server';
import { TrackingEngine } from '../../../services/tracking/TrackingEngine';
import { Logger } from '../../../lib/logger';
import { ClickRateLimiter } from '../../../services/security/ClickRateLimiter';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const publicationId = searchParams.get('p');
    const source = searchParams.get('s') || undefined; // source tracking parameter

    if (!publicationId) {
      // Fallback page if no id
      return new NextResponse('Oferta não encontrada ou link inválido.', { status: 404 });
    }

    // Capture metadata
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || undefined;

    // Rate limit check
    if (!ClickRateLimiter.isAllowed(ip)) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }

    // Track click and get final destination
    const destinationUrl = await TrackingEngine.registerClickAndGetRedirect(publicationId, {
      ip: ip !== 'unknown' ? ip : undefined,
      userAgent,
      source
    });

    // Valid offer, redirect to affiliate link!
    return NextResponse.redirect(destinationUrl, 302);
  } catch (error: any) {
    Logger.error('API_R', 'REDIRECT_FAILED', `Redirect Failed: ${error.message}`);
    // Instead of redirecting to the generic store, we could render a branded "Offer Expired" page.
    return new NextResponse(`Desculpe, esta oferta não está mais disponível. Erro: ${error.message}`, { status: 410 });
  }
}
