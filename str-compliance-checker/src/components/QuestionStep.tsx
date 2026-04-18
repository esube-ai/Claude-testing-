import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { CityInfoPanel } from './CityInfoPanel';
import type { Question, Answers, CityData } from '../types';

interface Props {
  questions: Question[];
  answers: Answers;
  city: CityData;
  onAnswerChange: (field: keyof Answers, value: unknown) => void;
  onComplete: () => void;
  onBack: () => void;
}

export function QuestionStep({ questions, answers, city, onAnswerChange, onComplete, onBack }: Props) {
  const [idx, setIdx] = useState(0);
  const [touched, setTouched] = useState(false);

  const visible = questions.filter(q => {
    if (!q.dependsOn) return true;
    return answers[q.dependsOn.field] === q.dependsOn.value;
  });

  const current = visible[idx];
  const isLast = idx === visible.length - 1;
  const currentAnswer = current ? answers[current.id] : null;

  function answered(): boolean {
    return currentAnswer !== null && currentAnswer !== undefined;
  }

  function next() {
    if (!answered()) { setTouched(true); return; }
    setTouched(false);
    if (isLast) onComplete(); else setIdx(i => i + 1);
  }

  function back() {
    setTouched(false);
    if (idx === 0) onBack(); else setIdx(i => i - 1);
  }

  if (!current) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Questions panel */}
      <div className="flex-1 min-w-0 space-y-6">
        <ProgressBar current={idx + 1} total={visible.length} />

        <div className="space-y-5 min-h-48">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">{city.name}</p>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">{current.text}</h3>
            {current.subtext && <p className="text-sm text-slate-500 mt-1.5">{current.subtext}</p>}
          </div>

          {/* Boolean */}
          {current.type === 'boolean' && (
            <div className="flex gap-3">
              {[{ label: 'Yes', value: true }, { label: 'No', value: false }].map(opt => (
                <button key={String(opt.value)}
                  onClick={() => { setTouched(false); onAnswerChange(current.id, opt.value); }}
                  className={`flex-1 py-3.5 rounded-xl border-2 font-semibold text-sm transition-all ${
                    currentAnswer === opt.value
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Select */}
          {current.type === 'select' && (
            <div className="space-y-2">
              {current.options?.map(opt => (
                <button key={opt.value}
                  onClick={() => { setTouched(false); onAnswerChange(current.id, opt.value); }}
                  className={`w-full py-3 px-4 rounded-xl border-2 text-sm text-left font-medium transition-all ${
                    currentAnswer === opt.value
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Number */}
          {current.type === 'number' && (
            <input
              type="number"
              value={currentAnswer !== null && currentAnswer !== undefined ? String(currentAnswer) : ''}
              min={current.min} max={current.max} placeholder={current.placeholder}
              onChange={e => {
                setTouched(false);
                const n = parseInt(e.target.value, 10);
                onAnswerChange(current.id, isNaN(n) ? null : n);
              }}
              className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 text-sm"
            />
          )}

          {touched && !answered() && (
            <p className="text-red-500 text-sm font-medium">Please answer this question to continue.</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={back}
            className="flex items-center gap-1 px-4 py-2.5 text-slate-600 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button onClick={next}
            className="flex-1 flex items-center justify-center gap-1 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm">
            {isLast ? 'Check Compliance' : <>Next <ChevronRight className="w-4 h-4" /></>}
          </button>
        </div>
      </div>

      {/* City info sidebar — hidden on mobile, shown on lg+ */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-4 bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <CityInfoPanel city={city} />
        </div>
      </div>
    </div>
  );
}
