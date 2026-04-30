import { useState, useCallback, useEffect } from 'react';
import { ShieldCheck, Home, Loader2 } from 'lucide-react';
import { AddressStep } from './components/AddressStep';
import { QuestionStep } from './components/QuestionStep';
import { ResultsStep } from './components/ResultsStep';
import { getQuestionsForCity } from './data/questions';
import { api } from './api/client';
import type { CityData, Answers, ComplianceResult } from './types';

type Step = 'address' | 'questions' | 'results';

const EMPTY: Answers = {
  isPrimaryResidence: null, ownershipType: null, daysPerYear: null,
  isHosted: null, guestsAtOnce: null, hasPermit: null, propertyType: null,
  hasHOA: null, bedroomCount: null, zoningType: null,
  hasLiabilityInsurance: null, insuranceCoverage: null, isEntireUnit: null,
};

export default function App() {
  const [step, setStep] = useState<Step>('address');
  const [cities, setCities] = useState<CityData[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [citiesError, setCitiesError] = useState('');
  const [city, setCity] = useState<CityData | null>(null);
  const [address, setAddress] = useState<string | undefined>();
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [checking, setChecking] = useState(false);

  // Load all cities (with their regulation rules) from the API
  useEffect(() => {
    setCitiesLoading(true);
    api.getCities()
      .then(data => {
        // Fetch full details (including regulation rules) for each city in parallel
        return Promise.all(data.map(c => api.getCity(c.id)));
      })
      .then(setCities)
      .catch(e => setCitiesError(e.message ?? 'Failed to load city data'))
      .finally(() => setCitiesLoading(false));
  }, []);

  const handleCitySelected = useCallback((selected: CityData, addr?: string) => {
    setCity(selected);
    setAddress(addr);
    setAnswers(EMPTY);
    setResult(null);
    setStep('questions');
  }, []);

  const handleAnswerChange = useCallback((field: keyof Answers, value: unknown) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleQuestionsComplete = useCallback(async () => {
    if (!city) return;
    setChecking(true);
    try {
      const compliance = await api.checkCompliance(city.id, answers);
      setResult(compliance);
      setStep('results');
    } catch (e) {
      console.error('Compliance check failed:', e);
    } finally {
      setChecking(false);
    }
  }, [city, answers]);

  const handleRestart = useCallback(() => {
    setStep('address');
    setCity(null);
    setAddress(undefined);
    setAnswers(EMPTY);
    setResult(null);
  }, []);

  const handleRetake = useCallback(() => {
    setAnswers(EMPTY);
    setResult(null);
    setStep('questions');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-none">STR Compliance Checker</h1>
              <p className="text-xs text-slate-400 mt-0.5">Short-Term Rental Regulations</p>
            </div>
          </div>

          {city && step !== 'address' && (
            <div className="ml-4 hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-xs text-slate-300 font-medium">{city.name}, {city.state}</span>
            </div>
          )}

          {step !== 'address' && (
            <button onClick={handleRestart}
              className="ml-auto flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
              <Home className="w-3.5 h-3.5" /> Start over
            </button>
          )}
        </div>
      </header>

      {/* City bar */}
      {city && address && step !== 'address' && (
        <div className="bg-blue-600 text-center py-1.5 text-xs text-blue-100">
          Checking: <span className="font-semibold text-white">{address}</span>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">

            {/* Loading cities */}
            {citiesLoading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-sm text-slate-500">Loading city regulations…</p>
              </div>
            )}

            {/* Error loading cities */}
            {!citiesLoading && citiesError && (
              <div className="text-center py-12">
                <p className="text-red-600 font-semibold">Failed to connect to the API</p>
                <p className="text-sm text-slate-500 mt-1">{citiesError}</p>
                <p className="text-xs text-slate-400 mt-3">Make sure the API server is running: <code className="bg-slate-100 px-1 rounded">npm run dev</code></p>
              </div>
            )}

            {/* Steps */}
            {!citiesLoading && !citiesError && (
              <>
                {step === 'address' && (
                  <AddressStep cities={cities} onCitySelected={handleCitySelected} />
                )}

                {step === 'questions' && city && (
                  checking ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      <p className="text-sm text-slate-500">Running compliance check…</p>
                    </div>
                  ) : (
                    <QuestionStep
                      questions={getQuestionsForCity(city)}
                      answers={answers}
                      city={city}
                      onAnswerChange={handleAnswerChange}
                      onComplete={handleQuestionsComplete}
                      onBack={() => setStep('address')}
                    />
                  )
                )}

                {step === 'results' && result && (
                  <ResultsStep
                    result={result}
                    address={address}
                    onRestart={handleRestart}
                    onRetake={handleRetake}
                  />
                )}
              </>
            )}
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">
            Data sourced from official city portals · Regulations verified April 2026 · Not legal advice
          </p>
        </div>
      </main>
    </div>
  );
}
