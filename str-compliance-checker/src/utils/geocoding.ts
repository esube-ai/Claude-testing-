import { detectCityFromGeocode } from '../data/cities';
import type { CityRegulation } from '../types';

interface CensusGeocodeResult {
  result: {
    input: { address: { address: string } };
    addressMatches: Array<{
      matchedAddress: string;
      coordinates: { x: number; y: number };
      addressComponents: {
        city: string;
        state: string;
        zip: string;
        streetName: string;
        preQualifier?: string;
      };
      geographies?: {
        Counties?: Array<{ NAME: string; STATE: string }>;
        'Incorporated Places'?: Array<{ NAME: string }>;
      };
    }>;
  };
}

export interface GeocodeResult {
  formattedAddress: string;
  city: string;
  state: string;
  county?: string;
  detectedCity: CityRegulation | undefined;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  const encoded = encodeURIComponent(address);
  // Census Geocoder — free, no API key, returns address components + county
  const url =
    `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress` +
    `?address=${encoded}&benchmark=Public_AR_Current&vintage=Current_Current&layers=all&format=json`;

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Geocoding request failed: ${res.status}`);

  const data: CensusGeocodeResult = await res.json();
  const matches = data.result.addressMatches;

  if (!matches || matches.length === 0) {
    throw new Error('Address not found. Please check the address and try again.');
  }

  const match = matches[0];
  const { city, state } = match.addressComponents;

  // Extract county from geographies if available
  const counties = match.geographies?.Counties;
  const county = counties && counties.length > 0
    ? counties[0].NAME
    : undefined;

  const detectedCity = detectCityFromGeocode(city, state, county);

  return {
    formattedAddress: match.matchedAddress,
    city,
    state,
    county,
    detectedCity,
  };
}
