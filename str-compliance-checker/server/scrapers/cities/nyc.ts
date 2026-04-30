import { BaseScraper, type ScrapeResult } from '../base.js';

export class NYCScraper extends BaseScraper {
  readonly cityId = 'nyc';
  readonly sourceUrls = [
    'https://www.nyc.gov/site/specialenforcement/short-term-rentals/registration.page',
    'https://www.nyc.gov/site/specialenforcement/short-term-rentals/index.page',
  ];

  async scrape(): Promise<ScrapeResult> {
    for (const url of this.sourceUrls) {
      const html = await this.fetchPage(url);
      if (!html) continue;

      const update: ScrapeResult['update'] = {};
      const fieldsUpdated: string[] = [];

      // NYC Local Law 18 fee is $145 — check if it changed
      const feeMatch = html.match(/\$\s*(\d+)\s*(?:registration\s*fee|fee|one-?time)/i);
      if (feeMatch) {
        const fee = `$${feeMatch[1]} one-time registration fee`;
        update.permit_fee = fee;
        fieldsUpdated.push('permit_fee');
      }

      // Check if host-presence language still present
      const hasHostPresence = /host\s*must\s*be\s*present|presence\s*of\s*the\s*host|permanently\s*reside/i.test(html);
      if (!hasHostPresence) {
        // Rules may have changed — flag for review
        fieldsUpdated.push('!host_presence_language_missing');
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
