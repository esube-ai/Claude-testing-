import { BaseScraper, type ScrapeResult } from '../base.js';

export class WashingtonDCScraper extends BaseScraper {
  readonly cityId = 'washington-dc';
  readonly sourceUrls = [
    'https://dlcp.dc.gov/page/short-term-rentals',
    'https://dcra.dc.gov/node/1470181',
  ];

  async scrape(): Promise<ScrapeResult> {
    for (const url of this.sourceUrls) {
      const html = await this.fetchPage(url);
      if (!html) continue;

      const update: ScrapeResult['update'] = {};
      const fieldsUpdated: string[] = [];

      const fee = this.extractFee(html, 'license fee');
      if (fee) { update.permit_fee = fee; fieldsUpdated.push('permit_fee'); }

      // Check $250K insurance minimum
      const insMatch = html.match(/\$([\d,]+)\s*(?:in\s*)?(?:liability\s*)?insurance/i);
      if (insMatch) {
        const amount = parseInt(insMatch[1].replace(/,/g, ''));
        if (amount !== 250000) { update.liability_insurance_min = amount; fieldsUpdated.push('liability_insurance_min'); }
      }

      // Check if renter eligibility language present (2026 change)
      const hasRenterLanguage = /renter|tenant|lessee/i.test(html);
      if (hasRenterLanguage) fieldsUpdated.push('renter_language_confirmed');

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
