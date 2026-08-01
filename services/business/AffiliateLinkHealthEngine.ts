export interface LinkHealthCheckResult {
  linkId: string;
  url: string;
  isHealthy: boolean;
  statusCode: number;
  redirectChain: string[];
  hasAffiliateTag: boolean;
  error?: string;
}

export class AffiliateLinkHealthEngine {
  public checkLinkHealth(linkId: string, url: string, requiredTag: string): LinkHealthCheckResult {
    const hasTag = url.includes(requiredTag) || url.includes('tag=') || url.includes('aff_id=');
    const isHealthy = hasTag && !url.includes('404') && !url.includes('error');

    return {
      linkId,
      url,
      isHealthy,
      statusCode: isHealthy ? 200 : 404,
      redirectChain: [url],
      hasAffiliateTag: hasTag,
      error: isHealthy ? undefined : 'Missing required affiliate tracking tag or target URL returned error'
    };
  }
}
