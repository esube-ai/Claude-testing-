import { BaseScraper, type ScrapeResult } from '../base.js';

export class SeattleScraper extends BaseScraper {
  readonly cityId = 'seattle';
  readonly sourceUrls = [
    'https://www.seattle.gov/license-and-tax-administration/business-license-tax/short-term-rentals',
  ];

  async scrape(): Promise<ScrapeResult> {
    for (const url of this.sourceUrls) {
      const html = await this.fetchPage(url);
      if (!html) continue;

      const update: ScrapeResult['update'] = {};
      const fieldsUpdated: string[] = [];

      const fee = this.extractFee(html, "operator's license");
      if (fee) { update.permit_fee = fee; fieldsUpdated.push('permit_fee'); }

      const maxUnitsMatch = html.match(/(\d)\s*(?:short-?term\s*rental\s*)?units?/i);
      if (maxUnitsMatch && parseInt(maxUnitsMatch[1]) !== 2) {
        fieldsUpdated.push('!max_units_changed');
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
