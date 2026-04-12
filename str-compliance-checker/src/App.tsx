import { useState, useCallback } from 'react';
import { Home, ShieldCheck } from 'lucide-react';
import { AddressStep } from './components/AddressStep';
import { QuestionStep } from './components/QuestionStep';
import { ResultsStep } from './components/ResultsStep';
import { getQuestionsForCity } from './data/questions';
import { checkCompliance } from './utils/compliance';
import type { CityRegulation, Answers, ComplianceResult } from './types';

type Step = 'address' | 'questions' | 'results';

const EMPTY_ANSWERS: Answers = {
  isPrimaryResidence: null,
  ownershipType: null,
  daysPerYear: null,
  isHosted: null,
  guestsAtOnce: null,
  hasPermit: null,
  propertyType: null,
  hasHOA: null,
  bedroomCount: null,
  zoningType: null,
  hasLiabilityInsurance: null,
  insuranceCoverage: null,
  isEntireUnit: null,
};

export default function App() {
  const [step, setStep] = useState<Step>('address');
  const [city, setCity] = useState<CityRegulation | null>(null);
  const [address, setAddress] = useState<string | undefined>();
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [result, setResult] = useState<ComplianceResult | null>(null);

  const handleCitySelected = useCallback((selectedCity: CityRegulation, addr?: string) => {
    setCity(selectedCity);
    setAddress(addr);
    setAnswers(EMPTY_ANSWERS);
    setStep('questions');
  }, []);

  const handleAnswerChange = useCallback((field: keyof Answers, value: unknown) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleQuestionsComplete = useCallback(() => {
    if (!city) return;
    const complianceResult = checkCompliance(city, answers);
    setResult(complianceResult);
    setStep('results');
  }, [city, answers]);

  const handleRestart = useCallback(() => {
    setStep('address');
    setCity(null);
    setAddress(undefined);
    setAnswers(EMPTY_ANSWERS);
    setResult(null);
  }, []);

  const handleRetake = useCallback(() => {
    setAnswers(EMPTY_ANSWERS);
    setResult(null);
    setStep('questions');
  }, []);

  const questions = city ? getQuestionsForCity(city) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">STR Compliance Checker</h1>
            <p className="text-xs text-gray-500">Short-Term Rental Regulations · 12 Major US Cities</p>
          </div>
          {step !== 'address' && (
            <button
              onClick={handleRestart}
              className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Start over
            </button>
          )}
        </div>
      </header>

      {/* City Indicator */}
      {city && step !== 'address' && (
        <div className="bg-blue-600 text-white text-center py-1.5 text-xs font-medium">
          Checking regulations for: {city.name}, {city.state}
          {address && <span className="opacity-75"> · {address}</span>}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            {step === 'address' && (
              <AddressStep onCitySelected={handleCitySelected} />
            )}

            {step === 'questions' && city && (
              <QuestionStep
                questions={questions}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onComplete={handleQuestionsComplete}
                onBack={() => setStep('address')}
                cityName={`${city.name}, ${city.state}`}
              />
            )}

            {step === 'results' && result && (
              <ResultsStep
                result={result}
                address={address}
                onRestart={handleRestart}
                onRetake={handleRetake}
              />
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-4">
            Data sourced from official city portals · Last updated April 2026 · Not legal advice
          </p>
        </div>
      </main>
    </div>
  );
}
