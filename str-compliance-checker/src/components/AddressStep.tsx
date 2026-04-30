import { useState } from 'react';
import { MapPin, Search, ChevronDown, Building2 } from 'lucide-react';
import { api } from '../api/client';
import type { CityData } from '../types';

interface Props {
  cities: CityData[];
  onCitySelected: (city: CityData, address?: string) => void;
}

export function AddressStep({ cities, onCitySelected }: Props) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualOpen, setManualOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  async function handleSearch() {
    if (!address.trim()) { setError('Please enter an address.'); return; }
    setLoading(true); setError('');
    try {
      const result = await api.geocode(address.trim());
      if (result.detectedCityId) {
        const city = cities.find(c => c.id === result.detectedCityId);
        if (city) { onCitySelected(city, result.formattedAddress); return; }
      }
      setError(
        result.detectedCityName
          ? `${result.detectedCityName} isn't in our database yet. Select your city below.`
          : `Address found in ${result.city}, ${result.state} — not in our 12 supported cities. Select manually.`
      );
      setManualOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lookup failed. Please select your city below.');
      setManualOpen(true);
    } finally { setLoading(false); }
  }

  function handleManualContinue() {
    const city = cities.find(c => c.id === selectedId);
    if (!city) { setError('Please select a city.'); return; }
    onCitySelected(city, address.trim() || undefined);
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
          <MapPin className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Check Your Rental Compliance</h2>
          <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
            Enter your property address and we'll apply the correct city regulations automatically.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="123 Main St, New York, NY 10001"
              className="w-full pl-9 pr-3 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
          <button
            onClick={handleSearch} disabled={loading}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors font-medium text-sm shadow-sm"
          >
            {loading
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Search className="w-4 h-4" />}
            {loading ? 'Looking up…' : 'Check'}
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
            <span className="mt-0.5">⚠</span> {error}
          </div>
        )}

        <button onClick={() => setManualOpen(v => !v)}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors">
          <ChevronDown className={`w-4 h-4 transition-transform ${manualOpen ? 'rotate-180' : ''}`} />
          Select city manually
        </button>
      </div>

      {/* Manual city picker */}
      {manualOpen && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Select your city
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {cities.map(city => (
              <button
                key={city.id}
                onClick={() => setSelectedId(city.id)}
                className={`relative flex flex-col p-3 rounded-xl border-2 text-left transition-all ${
                  selectedId === city.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className={`text-sm font-semibold ${selectedId === city.id ? 'text-blue-700' : 'text-slate-800'}`}>
                  {city.name}
                </span>
                <span className={`text-xs mt-0.5 ${selectedId === city.id ? 'text-blue-500' : 'text-slate-400'}`}>
                  {city.state}
                </span>
                {city.permitRequired && (
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-400" title="Permit required" />
                )}
              </button>
            ))}
          </div>
          {selectedId && (
            <button
              onClick={handleManualContinue}
              className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Continue with {cities.find(c => c.id === selectedId)?.name} →
            </button>
          )}
        </div>
      )}

      {/* Supported cities strip */}
      <div className="pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-400 text-center">
          Covers {cities.length} major US cities · Regulations sourced from official city portals · Updated 2026
        </p>
      </div>
    </div>
  );
}
