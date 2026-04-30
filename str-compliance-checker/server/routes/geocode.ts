import { Router } from 'express';
import { getDb, type CityRow } from '../db/index.js';

const router = Router();

interface CensusMatch {
  matchedAddress: string;
  addressComponents: { city: string; state: string; zip: string };
  geographies?: {
    Counties?: Array<{ NAME: string }>;
  };
}

router.get('/', async (req, res) => {
  const address = req.query.address as string;
  if (!address?.trim()) return res.status(400).json({ error: 'address query param required' });

  try {
    const url =
      `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress` +
      `?address=${encodeURIComponent(address)}&benchmark=Public_AR_Current&vintage=Current_Current&layers=all&format=json`;

    const resp = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!resp.ok) throw new Error(`Census API ${resp.status}`);

    const data = await resp.json() as { result: { addressMatches: CensusMatch[] } };
    const matches = data.result.addressMatches;

    if (!matches?.length) {
      return res.status(404).json({ error: 'Address not found. Please check the address and try again.' });
    }

    const match = matches[0];
    const { city, state } = match.addressComponents;
    const county = match.geographies?.Counties?.[0]?.NAME ?? '';

    // Match to our cities DB
    const cities = getDb().prepare('SELECT * FROM cities').all() as CityRow[];
    const cityLower = city.toLowerCase();
    const countyLower = county.toLowerCase();
    const stateLower = state.toLowerCase();

    const detected = cities.find(c => {
      if (c.state.toLowerCase() !== stateLower && c.state.toLowerCase() !== stateLower.slice(0, 2)) return false;
      const aliases = JSON.parse(c.aliases) as string[];
      const counties = JSON.parse(c.counties) as string[];
      return (
        aliases.some(a => cityLower.includes(a) || a.includes(cityLower)) ||
        counties.some(co => countyLower.includes(co) || co.includes(countyLower))
      );
    });

    return res.json({
      formattedAddress: match.matchedAddress,
      city,
      state,
      county,
      detectedCityId: detected?.id ?? null,
      detectedCityName: detected?.name ?? null,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Geocoding failed';
    return res.status(502).json({ error: msg });
  }
});

export default router;
