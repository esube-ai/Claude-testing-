import { BaseScraper, type ScrapeResult } from '../base.js';

export class MiamiScraper extends BaseScraper {
  readonly cityId = 'miami';
  readonly sourceUrls = [
    'https://www.myfloridalicense.com/DBPR/hotels-restaurants/vacation-rentals/',
    'https://www.miamidade.gov/business/vacation-rentals.asp',
  ];

  async scrape(): Promise<ScrapeResult> {
    for (const url of this.sourceUrls) {
      const html = await this.fetchPage(url);
      if (!html) continue;

      const update: ScrapeResult['update'] = {};
      const fieldsUpdated: string[] = [];

      // DBPR license fee check
      const fee = this.extractFee(html, 'license fee');
      if (fee) { update.permit_fee = fee; fieldsUpdated.push('permit_fee'); }

      // Verify residential ban language still present
      const hasBan = /residential\s*(?:zone|district|area)|R-1|R1|prohibited/i.test(html);
      if (!hasBan) fieldsUpdated.push('!residential_ban_language_missing');

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
