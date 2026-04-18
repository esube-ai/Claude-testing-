import { BaseScraper, type ScrapeResult } from '../base.js';

export class NashvilleScraper extends BaseScraper {
  readonly cityId = 'nashville';
  readonly sourceUrls = [
    'https://www.nashville.gov/departments/codes/short-term-rentals',
    'https://www.nashville.gov/departments/codes/short-term-rentals/apply-short-term-rental-property-permit',
  ];

  async scrape(): Promise<ScrapeResult> {
    for (const url of this.sourceUrls) {
      const html = await this.fetchPage(url);
      if (!html) continue;

      const update: ScrapeResult['update'] = {};
      const fieldsUpdated: string[] = [];

      // Check fee (currently $313)
      const feeMatch = html.match(/\$\s*([\d,]+(?:\.\d{2})?)\s*(?:per\s*year|annual|fee)/i);
      if (feeMatch) { update.permit_fee = `$${feeMatch[1]}/year`; fieldsUpdated.push('permit_fee'); }

      // Check $1M insurance requirement
      const hasInsurance = /1[,.]?000[,.]?000|one\s*million/i.test(html);
      if (!hasInsurance) fieldsUpdated.push('!insurance_language_missing');

      // Check max bedrooms (currently 4)
      const bedroomMatch = html.match(/(\d)\s*(?:sleeping\s*rooms?|bedrooms?)\s*(?:maximum|max|per\s*permit)/i);
      if (bedroomMatch && parseInt(bedroomMatch[1]) !== 4) {
        update.max_bedrooms = parseInt(bedroomMatch[1]);
        fieldsUpdated.push('max_bedrooms');
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
