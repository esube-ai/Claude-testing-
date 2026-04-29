CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  aliases TEXT NOT NULL DEFAULT '[]',
  counties TEXT NOT NULL DEFAULT '[]',
  permit_required INTEGER NOT NULL DEFAULT 1,
  permit_fee TEXT NOT NULL DEFAULT '',
  permit_renewal_fee TEXT,
  permit_link TEXT NOT NULL DEFAULT '',
  primary_residence_required INTEGER NOT NULL DEFAULT 0,
  hosted_day_limit INTEGER,
  unhosted_day_limit INTEGER,
  max_guests INTEGER,
  allowed_zones TEXT NOT NULL DEFAULT '[]',
  prohibited_zones TEXT NOT NULL DEFAULT '[]',
  tax_rate REAL,
  tax_note TEXT NOT NULL DEFAULT '',
  liability_insurance_required INTEGER NOT NULL DEFAULT 0,
  liability_insurance_min INTEGER,
  max_bedrooms INTEGER,
  requires_host_presence INTEGER,
  non_owner_occupied_allowed INTEGER NOT NULL DEFAULT 0,
  non_owner_occupied_zones TEXT NOT NULL DEFAULT '[]',
  renters_allowed INTEGER NOT NULL DEFAULT 0,
  last_updated TEXT NOT NULL,
  scrape_status TEXT NOT NULL DEFAULT 'seeded',
  scraped_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS regulation_rules (
  id TEXT NOT NULL,
  city_id TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  rule_text TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  source_url TEXT,
  last_verified TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (id, city_id),
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS scrape_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  city_id TEXT NOT NULL,
  scraped_at TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT NOT NULL,
  source_url TEXT,
  fields_updated TEXT NOT NULL DEFAULT '[]',
  changes_detected INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  FOREIGN KEY (city_id) REFERENCES cities(id)
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  checks_this_month INTEGER NOT NULL DEFAULT 0,
  checks_reset_at TEXT NOT NULL DEFAULT (date('now', 'start of month', '+1 month')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_regulation_rules_city ON regulation_rules(city_id);
CREATE INDEX IF NOT EXISTS idx_scrape_log_city ON scrape_log(city_id);
CREATE INDEX IF NOT EXISTS idx_scrape_log_date ON scrape_log(scraped_at DESC);
