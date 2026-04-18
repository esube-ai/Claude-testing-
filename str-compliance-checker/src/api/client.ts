import type { CityData, ComplianceResult, Answers } from '../types';

const BASE = '/api';

async function req<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE + url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `Request failed: ${res.status}`);
  return data as T;
}

export const api = {
  getCities: () => req<CityData[]>('/cities'),

  getCity: (id: string) => req<CityData>(`/cities/${id}`),

  checkCompliance: (cityId: string, answers: Answers) =>
    req<ComplianceResult>('/compliance', {
      method: 'POST',
      body: JSON.stringify({ cityId, answers }),
    }),

  geocode: (address: string) =>
    req<{
      formattedAddress: string;
      city: string;
      state: string;
      county: string;
      detectedCityId: string | null;
      detectedCityName: string | null;
    }>(`/geocode?address=${encodeURIComponent(address)}`),

  getScrapeStatus: () =>
    req<Array<{
      id: string; name: string; scrape_status: string;
      scraped_at: string | null; last_updated: string;
      last_run_status: string | null; changes_detected: number;
    }>>('/scrape/status'),
};
