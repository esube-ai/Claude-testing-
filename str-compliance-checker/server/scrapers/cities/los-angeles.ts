import { BaseScraper, type ScrapeResult } from '../base.js';

export class LAScraper extends BaseScraper {
  readonly cityId = 'los-angeles';
  readonly sourceUrls = [
    'https://planning.lacity.gov/plans-policies/home-sharing',
    'https://planning.lacity.org/plans-policies/home-sharing',
  ];

  async scrape(): Promise<ScrapeResult> {
    for (const url of this.sourceUrls) {
      const html = await this.fetchPage(url);
      if (!html) continue;

      const update: ScrapeResult['update'] = {};
      const fieldsUpdated: string[] = [];

      // Check for permit fee changes
      const fee = this.extractFee(html, 'permit');
      if (fee) { update.permit_fee = fee; fieldsUpdated.push('permit_fee'); }

      // Check for day limit changes (currently 120)
      const limit = this.extractDayLimit(html, 'unhosted');
      if (limit && limit !== 120) {
        update.unhosted_day_limit = limit;
        fieldsUpdated.push('unhosted_day_limit');
      }

      // Check TOT rate
      const taxMatch = html.match(/(\d{1,2}(?:\.\d)?)\s*%\s*(?:TOT|transient\s*occupancy\s*tax)/i);
      if (taxMatch) {
        const rate = parseFloat(taxMatch[1]);
        if (rate !== 14) { update.tax_rate = rate; fieldsUpdated.push('tax_rate'); }
      }

      return {
        cityId: this.cityId,
        status: fieldsUpdated.length > 0 ? 'success' : 'unchanged',
        sourceUrl: url,
        update: Object.keys(update).length > 0 ? update : undefined,
        fieldsUpdated,
      };
    }
    return { cityId: this.cityId, status: 'failed', fieldsUpdated: [], error: 'All source URLs unreachable' };
  }
}
