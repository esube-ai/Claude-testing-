import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import type { Question, Answers } from '../types';

interface Props {
  questions: Question[];
  answers: Answers;
  onAnswerChange: (field: keyof Answers, value: unknown) => void;
  onComplete: () => void;
  onBack: () => void;
  cityName: string;
}

export function QuestionStep({ questions, answers, onAnswerChange, onComplete, onBack, cityName }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touched, setTouched] = useState(false);

  // Filter questions by dependsOn
  const visibleQuestions = questions.filter(q => {
    if (!q.dependsOn) return true;
    const depValue = answers[q.dependsOn.field];
    return depValue === q.dependsOn.value;
  });

  const current = visibleQuestions[currentIndex];
  const isLast = currentIndex === visibleQuestions.length - 1;
  const currentAnswer = current ? answers[current.id] : null;

  function isAnswered(): boolean {
    if (!current) return false;
    const val = answers[current.id];
    if (val === null || val === undefined) return false;
    return true;
  }

  function handleNext() {
    if (!isAnswered()) {
      setTouched(true);
      return;
    }
    setTouched(false);
    if (isLast) {
      onComplete();
    } else {
      setCurrentIndex(i => i + 1);
    }
  }

  function handleBack() {
    setTouched(false);
    if (currentIndex === 0) {
      onBack();
    } else {
      setCurrentIndex(i => i - 1);
    }
  }

  if (!current) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{cityName}</p>
        <ProgressBar current={currentIndex + 1} total={visibleQuestions.length} />
      </div>

      <div className="min-h-48 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{current.text}</h3>
          {current.subtext && (
            <p className="text-sm text-gray-500 mt-1">{current.subtext}</p>
          )}
        </div>

        {/* Boolean question */}
        {current.type === 'boolean' && (
          <div className="flex gap-3">
            {[
              { label: 'Yes', value: true },
              { label: 'No', value: false },
            ].map(opt => (
              <button
                key={String(opt.value)}
                onClick={() => { setTouched(false); onAnswerChange(current.id, opt.value); }}
                className={`flex-1 py-3 rounded-lg border-2 font-medium text-sm transition-colors ${
                  currentAnswer === opt.value
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Select question */}
        {current.type === 'select' && (
          <div className="grid gap-2">
            {current.options?.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setTouched(false); onAnswerChange(current.id, opt.value); }}
                className={`w-full py-3 px-4 rounded-lg border-2 font-medium text-sm text-left transition-colors ${
                  currentAnswer === opt.value
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Number question */}
        {current.type === 'number' && (
          <div>
            <input
              type="number"
              value={currentAnswer !== null && currentAnswer !== undefined ? String(currentAnswer) : ''}
              min={current.min}
              max={current.max}
              placeholder={current.placeholder}
              onChange={e => {
                setTouched(false);
                const num = parseInt(e.target.value, 10);
                onAnswerChange(current.id, isNaN(num) ? null : num);
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
            />
          </div>
        )}

        {touched && !isAnswered() && (
          <p className="text-red-500 text-sm">Please answer this question to continue.</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 px-4 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          {isLast ? 'Check Compliance' : 'Next'}
          {!isLast && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
