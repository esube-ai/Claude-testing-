import { BaseScraper, type ScrapeResult } from '../base.js';

// New Orleans has a public permit dataset
const OPEN_DATA_URL = 'https://data.nola.gov/resource/6x5d-tptf.json?$limit=1&$select=count(*)';

export class NewOrleansScraper extends BaseScraper {
  readonly cityId = 'new-orleans';
  readonly sourceUrls = [
    'https://nola.gov/short-term-rental-administration/',
    'https://nola.gov/next/short-term-rental-administration/home/',
  ];

  async scrape(): Promise<ScrapeResult> {
    // Try open data first — actual permit counts
    const countData = await this.fetchJson<[{ count: string }]>(OPEN_DATA_URL);
    const activeCount = countData?.[0]?.count ? parseInt(countData[0].count) : null;

    for (const url of this.sourceUrls) {
      const html = await this.fetchPage(url);
      if (!html) continue;

      const update: ScrapeResult['update'] = {};
      const fieldsUpdated: string[] = [];

      if (activeCount !== null) fieldsUpdated.push(`open_data_verified:${activeCount}_permits`);

      const fee = this.extractFee(html, 'permit fee');
      if (fee) { update.permit_fee = fee; fieldsUpdated.push('permit_fee'); }

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
