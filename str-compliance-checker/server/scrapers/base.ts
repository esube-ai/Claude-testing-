export interface ScrapedUpdate {
  permit_fee?: string;
  permit_renewal_fee?: string;
  permit_link?: string;
  primary_residence_required?: boolean;
  hosted_day_limit?: number | null;
  unhosted_day_limit?: number | null;
  max_guests?: number | null;
  tax_rate?: number | null;
  tax_note?: string;
  liability_insurance_required?: boolean;
  liability_insurance_min?: number | null;
  max_bedrooms?: number | null;
  last_updated?: string;
}

export interface ScrapeResult {
  cityId: string;
  status: 'success' | 'partial' | 'failed' | 'unchanged';
  sourceUrl?: string;
  update?: ScrapedUpdate;
  fieldsUpdated: string[];
  error?: string;
}

const USER_AGENT = 'STRComplianceChecker/1.0 (compliance research tool; contact: info@example.com)';
const FETCH_TIMEOUT_MS = 12_000;

export abstract class BaseScraper {
  abstract readonly cityId: string;
  abstract readonly sourceUrls: string[];

  protected async fetchPage(url: string): Promise<string | null> {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
      });
      if (!res.ok) return null;
      return await res.text();
    } catch {
      return null;
    }
  }

  protected async fetchJson<T>(url: string): Promise<T | null> {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' },
      });
      if (!res.ok) return null;
      return (await res.json()) as T;
    } catch {
      return null;
    }
  }

  // Extract first dollar amount matching a pattern near a keyword
  protected extractFee(html: string, keyword: string): string | null {
    const idx = html.toLowerCase().indexOf(keyword.toLowerCase());
    if (idx === -1) return null;
    const window = html.slice(Math.max(0, idx - 200), idx + 400);
    const match = window.match(/\$\s*[\d,]+(?:\.\d{2})?(?:\s*(?:\/year|annually|one-time|per year))?/i);
    return match ? match[0].trim() : null;
  }

  // Extract a day limit number near a keyword
  protected extractDayLimit(html: string, keyword: string): number | null {
    const idx = html.toLowerCase().indexOf(keyword.toLowerCase());
    if (idx === -1) return null;
    const window = html.slice(Math.max(0, idx - 100), idx + 300);
    const match = window.match(/(\d{1,3})\s*days?\s*(?:per\s*(?:year|calendar\s*year))?/i);
    return match ? parseInt(match[1], 10) : null;
  }

  abstract scrape(): Promise<ScrapeResult>;
}
