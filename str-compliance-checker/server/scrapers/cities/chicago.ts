import { BaseScraper, type ScrapeResult } from '../base.js';

// Chicago also has open data: https://data.cityofchicago.org/Community-Economic-Development/Shared-Housing-Unit-/dwj9-5h8i
const OPEN_DATA_URL = 'https://data.cityofchicago.org/resource/dwj9-5h8i.json?$limit=1';

export class ChicagoScraper extends BaseScraper {
  readonly cityId = 'chicago';
  readonly sourceUrls = [
    'https://www.chicago.gov/city/en/depts/bacp/provdrs/special_inspections/svcs/short-term-residential-rentals.html',
  ];

  async scrape(): Promise<ScrapeResult> {
    // Try open data API first (most reliable)
    const rows = await this.fetchJson<Record<string, string>[]>(OPEN_DATA_URL);
    if (rows && rows.length > 0) {
      return {
        cityId: this.cityId,
        status: 'success',
        sourceUrl: OPEN_DATA_URL,
        fieldsUpdated: ['open_data_verified'],
      };
    }

    // Fallback: scrape the regulation page
    for (const url of this.sourceUrls) {
      const html = await this.fetchPage(url);
      if (!html) continue;

      const update: ScrapeResult['update'] = {};
      const fieldsUpdated: string[] = [];

      const fee = this.extractFee(html, 'registration fee');
      if (fee) { update.permit_fee = fee; fieldsUpdated.push('permit_fee'); }

      return {
        cityId: this.cityId,
        status: fieldsUpdated.length > 0 ? 'success' : 'unchanged',
        sourceUrl: url,
        update: Object.keys(update).length > 0 ? update : undefined,
        fieldsUpdated,
      };
    }
    return { cityId: this.cityId, status: 'failed', fieldsUpdated: [], error: 'All sources unreachable' };
  }
}
