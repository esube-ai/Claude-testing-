import { useState } from 'react';
import { MapPin, Search, ChevronDown } from 'lucide-react';
import { geocodeAddress } from '../utils/geocoding';
import { CITIES } from '../data/cities';
import type { CityRegulation } from '../types';

interface Props {
  onCitySelected: (city: CityRegulation, address?: string) => void;
}

export function AddressStep({ onCitySelected }: Props) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState('');

  async function handleAddressSearch() {
    if (!address.trim()) {
      setError('Please enter an address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await geocodeAddress(address.trim());
      if (result.detectedCity) {
        onCitySelected(result.detectedCity, result.formattedAddress);
      } else {
        setError(
          `We found your address in ${result.city}, ${result.state}, but that city isn't in our database yet. ` +
          `Please select your city manually below.`
        );
        setManualMode(true);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Geocoding failed. Please try again or select your city manually.';
      setError(msg);
      setManualMode(true);
    } finally {
      setLoading(false);
    }
  }

  function handleManualSelect() {
    const city = CITIES.find(c => c.id === selectedCityId);
    if (city) onCitySelected(city, address.trim() || undefined);
    else setError('Please select a city.');
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="p-4 bg-blue-100 rounded-full">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Enter Your Rental Address</h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          We'll automatically detect your city and apply the correct regulations.
          Covered cities: NYC, Los Angeles, Chicago, Miami, San Francisco, Seattle, Austin, Denver, Houston, Nashville, New Orleans, Washington DC.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddressSearch()}
              placeholder="123 Main St, New York, NY 10001"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={handleAddressSearch}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {loading ? 'Looking up…' : 'Check'}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={() => setManualMode(v => !v)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${manualMode ? 'rotate-180' : ''}`} />
          Select city manually
        </button>

        {manualMode && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
            <p className="text-sm text-gray-600 font-medium">Select your city:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CITIES.map(city => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCityId(city.id)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-colors text-left ${
                    selectedCityId === city.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium">{city.name}</div>
                  <div className={`text-xs ${selectedCityId === city.id ? 'text-blue-100' : 'text-gray-400'}`}>
                    {city.state}
                  </div>
                </button>
              ))}
            </div>
            {selectedCityId && (
              <button
                onClick={handleManualSelect}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Continue with {CITIES.find(c => c.id === selectedCityId)?.name}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
