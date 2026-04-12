import type { ReactNode } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, ExternalLink, RefreshCw, RotateCcw } from 'lucide-react';
import type { ComplianceResult, ComplianceRule, Severity } from '../types';

interface Props {
  result: ComplianceResult;
  address?: string;
  onRestart: () => void;
  onRetake: () => void;
}

const STATUS_CONFIG = {
  'compliant': {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: <CheckCircle className="w-8 h-8 text-green-600" />,
    badge: 'bg-green-100 text-green-800',
    label: 'Likely Compliant',
    description: 'Based on your answers, your rental appears to meet current regulations.',
  },
  'likely-compliant': {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
    badge: 'bg-blue-100 text-blue-800',
    label: 'Likely Compliant',
    description: 'Your setup looks good, but verify permit status and local requirements.',
  },
  'needs-registration': {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: <AlertTriangle className="w-8 h-8 text-yellow-600" />,
    badge: 'bg-yellow-100 text-yellow-800',
    label: 'Action Needed',
    description: 'You\'re close, but you need to complete registration or address warnings before listing.',
  },
  'non-compliant': {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: <XCircle className="w-8 h-8 text-red-600" />,
    badge: 'bg-red-100 text-red-800',
    label: 'Non-Compliant',
    description: 'One or more critical requirements are not met. Do not list until these are resolved.',
  },
};

const SEVERITY_CONFIG: Record<Severity, {
  icon: ReactNode;
  bg: string;
  border: string;
  text: string;
  badge: string;
  label: string;
}> = {
  pass: {
    icon: <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />,
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-900',
    badge: 'bg-green-100 text-green-700',
    label: 'Pass',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />,
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-900',
    badge: 'bg-yellow-100 text-yellow-700',
    label: 'Warning',
  },
  fail: {
    icon: <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-900',
    badge: 'bg-red-100 text-red-700',
    label: 'Fail',
  },
  info: {
    icon: <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    badge: 'bg-blue-100 text-blue-700',
    label: 'Info',
  },
};

function RuleCard({ rule }: { rule: ComplianceRule }) {
  const s = SEVERITY_CONFIG[rule.severity];
  return (
    <div className={`p-4 rounded-lg border ${s.bg} ${s.border}`}>
      <div className="flex items-start gap-3">
        {s.icon}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-semibold ${s.text}`}>{rule.title}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.badge}`}>{s.label}</span>
          </div>
          <p className={`text-sm mt-1 ${s.text} opacity-90`}>{rule.description}</p>
          {rule.recommendation && (
            <p className={`text-xs mt-1.5 ${s.text} opacity-75`}>
              <span className="font-medium">Recommendation:</span> {rule.recommendation}
            </p>
          )}
          {rule.officialLink && (
            <a
              href={rule.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1.5"
            >
              Official source <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function ResultsStep({ result, address, onRestart, onRetake }: Props) {
  const config = STATUS_CONFIG[result.overallStatus];

  const failRules = result.rules.filter(r => r.severity === 'fail');
  const warnRules = result.rules.filter(r => r.severity === 'warning');
  const passRules = result.rules.filter(r => r.severity === 'pass');
  const infoRules = result.rules.filter(r => r.severity === 'info');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-5 rounded-xl border-2 ${config.bg} ${config.border}`}>
        <div className="flex items-center gap-4">
          {config.icon}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{result.cityName}</h2>
              <span className={`text-sm px-2.5 py-0.5 rounded-full font-semibold ${config.badge}`}>
                {config.label}
              </span>
            </div>
            {address && <p className="text-sm text-gray-500 mb-1">{address}</p>}
            <p className="text-sm text-gray-600">{config.description}</p>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Compliance Score</span>
            <span className="font-semibold">{result.score}/100</span>
          </div>
          <div className="h-2.5 bg-white/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                result.score >= 80 ? 'bg-green-500' :
                result.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${result.score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Registration CTA */}
      {result.registrationRequired && (
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Permit / Registration Required</h3>
              <p className="text-sm text-gray-600 mt-0.5">{result.registrationFee}</p>
            </div>
            <a
              href={result.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex-shrink-0"
            >
              Apply Now <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Compliance Checks */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Compliance Checks</h3>

        {failRules.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-red-600 font-semibold uppercase tracking-wide">
              Issues ({failRules.length})
            </p>
            {failRules.map(r => <RuleCard key={r.id} rule={r} />)}
          </div>
        )}

        {warnRules.length > 0 && (
          <div className="space-y-2 mt-3">
            <p className="text-xs text-yellow-600 font-semibold uppercase tracking-wide">
              Warnings ({warnRules.length})
            </p>
            {warnRules.map(r => <RuleCard key={r.id} rule={r} />)}
          </div>
        )}

        {passRules.length > 0 && (
          <div className="space-y-2 mt-3">
            <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">
              Passing ({passRules.length})
            </p>
            {passRules.map(r => <RuleCard key={r.id} rule={r} />)}
          </div>
        )}

        {infoRules.length > 0 && (
          <div className="space-y-2 mt-3">
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
              Information ({infoRules.length})
            </p>
            {infoRules.map(r => <RuleCard key={r.id} rule={r} />)}
          </div>
        )}
      </div>

      {/* Key Requirements Reference */}
      <details className="group">
        <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-2 list-none">
          <span className="w-4 h-4 border-2 border-gray-400 rounded-full flex items-center justify-center text-xs group-open:rotate-180 transition-transform">▾</span>
          All {result.cityName} STR Requirements
        </summary>
        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <ul className="space-y-2">
            {result.keyRequirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-gray-400 flex-shrink-0 mt-0.5">•</span>
                {req}
              </li>
            ))}
          </ul>
          {result.registrationLink && (
            <a
              href={result.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-3"
            >
              Official {result.cityName} STR portal <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </details>

      {/* Disclaimer */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-500">
          <span className="font-semibold">Disclaimer:</span> This tool provides general information based on publicly
          available regulations as of early 2026 and is not legal advice. Regulations change frequently.
          Always verify with official city portals and consult a local attorney or licensed property manager
          before listing your property.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRetake}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Retake Questions
        </button>
        <button
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          New Check
        </button>
      </div>
    </div>
  );
}
