import { AffiliateDisclosureMissingError } from '../../types/global/global.errors';

export class AffiliateDisclosureLocalizationEngine {
  private disclosures: Map<string, string> = new Map([
    ['US', '#ad As an Amazon Associate I earn from qualifying purchases. #affiliatelink'],
    ['UK', '#ad Paid link. We earn commissions from qualifying purchases. #affiliate'],
    ['BR', '#ad #publi Link de afiliado pago. Recebemos comissão por vendas qualificadas.'],
    ['DE', '#werbung #anzeige Als Amazon-Partner verdiene ich an qualifizierten Verkäufen.'],
    ['ES', '#publi #ad Como afiliado de Amazon, percibo ingresos por las compras adscritas.'],
    ['FR', '#publi #ad En tant que Partenaire Amazon, je réalise un bénéfice sur les achats remplissant les conditions requises.']
  ]);

  public getLocalizedDisclosure(country: string): string {
    const code = country.toUpperCase();
    const disclosure = this.disclosures.get(code) || this.disclosures.get('US')!;
    if (!disclosure) {
      throw new AffiliateDisclosureMissingError(`Missing mandatory affiliate disclosure for country ${country}`, country);
    }
    return disclosure;
  }
}
