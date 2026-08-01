export class CountryPolicyEngine {
  /**
   * Retorna os termos regulatórios exigidos por país.
   */
  public static getLegalDisclosure(countryCode = 'BR'): string {
    switch (countryCode.toUpperCase()) {
      case 'US': return '#ad #affiliate #sponsored';
      case 'GB': return '#ad #affiliate';
      case 'DE': return '#werbung #anzeige';
      case 'FR': return '#publicité #partenariat';
      case 'ES': return '#publi #afiliado';
      default: return '#ad #afiliado #parceiro';
    }
  }
}
