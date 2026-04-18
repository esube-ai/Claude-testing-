import { BaseScraper, type ScrapeResult } from '../base.js';

export class SFScraper extends BaseScraper {
  readonly cityId = 'san-francisco';
  readonly sourceUrls = [
    'https://shorttermrentals.sfgov.org/',
    'https://shorttermrentals.sfgov.org/faq',
  ];

  async scrape(): Promise<ScrapeResult> {
    for (const url of this.sourceUrls) {
      const html = await this.fetchPage(url);
      if (!html) continue;

      const update: ScrapeResult['update'] = {};
      const fieldsUpdated: string[] = [];

      const fee = this.extractFee(html, 'registration');
      if (fee) { update.permit_fee = fee; fieldsUpdated.push('permit_fee'); }

      const limit = this.extractDayLimit(html, 'unhosted');
      if (limit && limit !== 90) {
        update.unhosted_day_limit = limit;
        fieldsUpdated.push('unhosted_day_limit');
      }

      const taxMatch = html.match(/(\d{1,2}(?:\.\d)?)\s*%\s*(?:hotel\s*tax|transient\s*occupancy)/i);
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
