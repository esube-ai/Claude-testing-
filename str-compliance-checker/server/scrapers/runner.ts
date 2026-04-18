import { getDb } from '../db/index.js';
import { seedDatabase } from '../db/seed.js';
import { NYCScraper } from './cities/nyc.js';
import { LAScraper } from './cities/los-angeles.js';
import { ChicagoScraper } from './cities/chicago.js';
import { MiamiScraper } from './cities/miami.js';
import { SFScraper } from './cities/san-francisco.js';
import { SeattleScraper } from './cities/seattle.js';
import { AustinScraper } from './cities/austin.js';
import { DenverScraper } from './cities/denver.js';
import { HoustonScraper } from './cities/houston.js';
import { NashvilleScraper } from './cities/nashville.js';
import { NewOrleansScraper } from './cities/new-orleans.js';
import { WashingtonDCScraper } from './cities/washington-dc.js';
import type { BaseScraper } from './base.js';

const ALL_SCRAPERS: BaseScraper[] = [
  new NYCScraper(),
  new LAScraper(),
  new ChicagoScraper(),
  new MiamiScraper(),
  new SFScraper(),
  new SeattleScraper(),
  new AustinScraper(),
  new DenverScraper(),
  new HoustonScraper(),
  new NashvilleScraper(),
  new NewOrleansScraper(),
  new WashingtonDCScraper(),
];

export async function runScrapers(cityIds?: string[]): Promise<void> {
  const db = getDb();
  const scrapers = cityIds
    ? ALL_SCRAPERS.filter(s => cityIds.includes(s.cityId))
    : ALL_SCRAPERS;

  const updateCity = db.prepare(`
    UPDATE cities SET
      permit_fee = COALESCE(@permit_fee, permit_fee),
      hosted_day_limit = COALESCE(@hosted_day_limit, hosted_day_limit),
      unhosted_day_limit = COALESCE(@unhosted_day_limit, unhosted_day_limit),
      max_guests = COALESCE(@max_guests, max_guests),
      tax_rate = COALESCE(@tax_rate, tax_rate),
      max_bedrooms = COALESCE(@max_bedrooms, max_bedrooms),
      liability_insurance_min = COALESCE(@liability_insurance_min, liability_insurance_min),
      scrape_status = @scrape_status,
      scraped_at = datetime('now')
    WHERE id = @id
  `);

  const logScrape = db.prepare(`
    INSERT INTO scrape_log (city_id, status, source_url, fields_updated, changes_detected, error_message)
    VALUES (@city_id, @status, @source_url, @fields_updated, @changes_detected, @error_message)
  `);

  console.log(`Running scrapers for ${scrapers.length} cities…`);

  const results = await Promise.allSettled(scrapers.map(s => s.scrape()));

  for (const settled of results) {
    if (settled.status === 'rejected') {
      console.error('Scraper threw:', settled.reason);
      continue;
    }
    const r = settled.value;
    console.log(`  [${r.cityId}] ${r.status} — ${r.fieldsUpdated.join(', ') || 'no changes'}`);

    const realFields = r.fieldsUpdated.filter(f => !f.startsWith('!') && !f.startsWith('open_data'));
    const hasChanges = realFields.length > 0 && r.update;

    if (hasChanges && r.update) {
      updateCity.run({
        id: r.cityId,
        permit_fee: r.update.permit_fee ?? null,
        hosted_day_limit: r.update.hosted_day_limit ?? null,
        unhosted_day_limit: r.update.unhosted_day_limit ?? null,
        max_guests: r.update.max_guests ?? null,
        tax_rate: r.update.tax_rate ?? null,
        max_bedrooms: r.update.max_bedrooms ?? null,
        liability_insurance_min: r.update.liability_insurance_min ?? null,
        scrape_status: 'live',
      });
    } else {
      db.prepare(`UPDATE cities SET scraped_at = datetime('now'), scrape_status = @status WHERE id = @id`)
        .run({ id: r.cityId, status: r.status === 'failed' ? 'scrape_failed' : 'scraped' });
    }

    logScrape.run({
      city_id: r.cityId,
      status: r.status,
      source_url: r.sourceUrl ?? null,
      fields_updated: JSON.stringify(r.fieldsUpdated),
      changes_detected: hasChanges ? 1 : 0,
      error_message: r.error ?? null,
    });
  }

  console.log('Scrape run complete.');
}

// Standalone: tsx server/scrapers/runner.ts
if (process.argv[1]?.includes('runner')) {
  seedDatabase();
  runScrapers().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}
