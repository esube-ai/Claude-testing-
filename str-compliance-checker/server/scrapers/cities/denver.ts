import { BaseScraper, type ScrapeResult } from '../base.js';

export class DenverScraper extends BaseScraper {
  readonly cityId = 'denver';
  readonly sourceUrls = [
    'https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Denver-Community-Planning-and-Development/Permits-and-Licenses/Short-Term-Rentals',
  ];

  async scrape(): Promise<ScrapeResult> {
    for (const url of this.sourceUrls) {
      const html = await this.fetchPage(url);
      if (!html) continue;

      const update: ScrapeResult['update'] = {};
      const fieldsUpdated: string[] = [];

      const fee = this.extractFee(html, 'short-term rental license');
      if (fee) { update.permit_fee = fee; fieldsUpdated.push('permit_fee'); }

      // Check primary-residence language (180-day rule)
      const has180 = /180\s*days?/i.test(html);
      if (!has180) fieldsUpdated.push('!180_day_rule_language_missing');

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
