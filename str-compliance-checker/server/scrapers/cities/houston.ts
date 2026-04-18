import { BaseScraper, type ScrapeResult } from '../base.js';

export class HoustonScraper extends BaseScraper {
  readonly cityId = 'houston';
  readonly sourceUrls = [
    'https://www.houstontx.gov/housing/short-term-rental.html',
    'https://houstontx.gov/housing/short-term-rental.html',
  ];

  async scrape(): Promise<ScrapeResult> {
    for (const url of this.sourceUrls) {
      const html = await this.fetchPage(url);
      if (!html) continue;

      const update: ScrapeResult['update'] = {};
      const fieldsUpdated: string[] = [];

      // Check current fee (was $275 + $33.10 as of Jan 2026)
      const feeMatch = html.match(/\$\s*([\d,]+(?:\.\d{2})?)\s*(?:annual|per\s*year|registration\s*fee)/i);
      if (feeMatch) { update.permit_fee = `$${feeMatch[1]}/year registration fee`; fieldsUpdated.push('permit_fee'); }

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
