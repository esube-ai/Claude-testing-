import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Vercel: use in-memory DB (no persistent filesystem).
// Local/Docker: use a file-based DB.
const DB_PATH = process.env.DB_PATH ?? (process.env.VERCEL ? ':memory:' : join(__dirname, '../../data/str.db'));

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    // WAL mode only works on file-based DBs
    if (DB_PATH !== ':memory:') {
      _db.pragma('journal_mode = WAL');
    }
    _db.pragma('foreign_keys = ON');
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    _db.exec(schema);

    // Note: in-memory DB seeding is handled by the caller (api/index.ts or server/index.ts)
  }
  return _db;
}

export function closeDb(): void {
  _db?.close();
  _db = null;
}

export type CityRow = {
  id: string; name: string; state: string; aliases: string; counties: string;
  permit_required: number; permit_fee: string; permit_renewal_fee: string | null;
  permit_link: string; primary_residence_required: number;
  hosted_day_limit: number | null; unhosted_day_limit: number | null;
  max_guests: number | null; allowed_zones: string; prohibited_zones: string;
  tax_rate: number | null; tax_note: string; liability_insurance_required: number;
  liability_insurance_min: number | null; max_bedrooms: number | null;
  requires_host_presence: number | null; non_owner_occupied_allowed: number;
  non_owner_occupied_zones: string; renters_allowed: number; last_updated: string;
  scrape_status: string; scraped_at: string | null;
};

export type RuleRow = {
  id: string; city_id: string; category: string; title: string;
  rule_text: string; severity: string; source_url: string | null;
  last_verified: string | null; sort_order: number;
};

export function rowToCity(row: CityRow) {
  return {
    id: row.id, name: row.name, state: row.state,
    aliases: JSON.parse(row.aliases) as string[],
    counties: JSON.parse(row.counties) as string[],
    permitRequired: row.permit_required === 1,
    permitFee: row.permit_fee,
    permitRenewalFee: row.permit_renewal_fee ?? undefined,
    permitLink: row.permit_link,
    primaryResidenceRequired: row.primary_residence_required === 1,
    hostedDayLimit: row.hosted_day_limit,
    unhostedDayLimit: row.unhosted_day_limit,
    maxGuests: row.max_guests,
    allowedZones: JSON.parse(row.allowed_zones) as string[],
    prohibitedZones: JSON.parse(row.prohibited_zones) as string[],
    taxRate: row.tax_rate,
    taxNote: row.tax_note,
    liabilityInsuranceRequired: row.liability_insurance_required === 1,
    liabilityInsuranceMin: row.liability_insurance_min,
    maxBedrooms: row.max_bedrooms,
    requiresHostPresence: row.requires_host_presence === null ? null : row.requires_host_presence === 1,
    nonOwnerOccupiedAllowed: row.non_owner_occupied_allowed === 1,
    nonOwnerOccupiedZones: JSON.parse(row.non_owner_occupied_zones) as string[],
    rentersAllowed: row.renters_allowed === 1,
    lastUpdated: row.last_updated,
    scrapeStatus: row.scrape_status,
    scrapedAt: row.scraped_at,
  };
}
