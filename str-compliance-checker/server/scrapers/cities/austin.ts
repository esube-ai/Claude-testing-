import { BaseScraper, type ScrapeResult } from '../base.js';

// Austin has an open data API for active STR licenses
const OPEN_DATA_URL = 'https://data.austintexas.gov/resource/qwvp-gd3m.json?$limit=1&$select=count(*)';

export class AustinScraper extends BaseScraper {
  readonly cityId = 'austin';
  readonly sourceUrls = [
    'https://austintexas.gov/department/short-term-rentals',
    'https://www.austintexas.gov/department/short-term-rentals',
  ];

  async scrape(): Promise<ScrapeResult> {
    // Try open data first — gives live permit counts
    const countData = await this.fetchJson<[{ count: string }]>(OPEN_DATA_URL);
    const activeCount = countData?.[0]?.count ? parseInt(countData[0].count) : null;

    for (const url of this.sourceUrls) {
      const html = await this.fetchPage(url);
      if (!html) continue;

      const update: ScrapeResult['update'] = {};
      const fieldsUpdated: string[] = [];

      if (activeCount !== null) fieldsUpdated.push(`open_data_verified:${activeCount}_active_licenses`);

      // Check for fee changes (currently $779.14 / $437)
      const fee1Match = html.match(/\$\s*([\d,]+(?:\.\d{2})?)\s*(?:for\s*a\s*new|first[- ]time|initial)/i);
      const fee2Match = html.match(/\$\s*([\d,]+(?:\.\d{2})?)\s*(?:renewal|annually)/i);
      if (fee1Match || fee2Match) {
        const fee = [
          fee1Match ? `$${fee1Match[1]} first-time` : null,
          fee2Match ? `$${fee2Match[1]} renewal` : null,
        ].filter(Boolean).join('; ');
        if (fee) { update.permit_fee = fee; fieldsUpdated.push('permit_fee'); }
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
