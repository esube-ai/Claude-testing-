import type { ReactNode } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, ExternalLink, RefreshCw, RotateCcw, ChevronDown } from 'lucide-react';
import type { ComplianceResult, ComplianceRule, Severity } from '../types';
import { ScoreRing } from './ScoreRing';
import { DataBadge } from './DataBadge';

interface Props {
  result: ComplianceResult;
  address?: string;
  onRestart: () => void;
  onRetake: () => void;
}

const STATUS = {
  'compliant': {
    bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-700', label: 'Compliant',
    icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
    desc: 'Based on your answers, your rental meets current regulations.',
  },
  'likely-compliant': {
    bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800',
    badge: 'bg-blue-100 text-blue-700', label: 'Likely Compliant',
    icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
    desc: 'Your setup looks good — verify your permit status and local rules.',
  },
  'needs-registration': {
    bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800',
    badge: 'bg-amber-100 text-amber-700', label: 'Action Needed',
    icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
    desc: 'You\'re close — complete registration or resolve warnings before listing.',
  },
  'non-compliant': {
    bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800',
    badge: 'bg-red-100 text-red-700', label: 'Non-Compliant',
    icon: <XCircle className="w-6 h-6 text-red-600" />,
    desc: 'Critical requirements are not met. Do not list until these are resolved.',
  },
} as const;

const SEV: Record<Severity, {
  icon: ReactNode; bg: string; border: string; text: string; sub: string; badge: string; label: string;
}> = {
  pass:    { icon: <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', sub: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', label: 'Pass' },
  warning: { icon: <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />, bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-900',  sub: 'text-amber-700',  badge: 'bg-amber-100 text-amber-700',  label: 'Warning' },
  fail:    { icon: <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />,         bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-900',    sub: 'text-red-700',    badge: 'bg-red-100 text-red-700',     label: 'Fail' },
  info:    { icon: <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />,           bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-900',   sub: 'text-blue-700',   badge: 'bg-blue-100 text-blue-700',    label: 'Info' },
};

function RuleCard({ rule }: { rule: ComplianceRule }) {
  const s = SEV[rule.severity];
  return (
    <div className={`p-3.5 rounded-xl border ${s.bg} ${s.border}`}>
      <div className="flex items-start gap-2.5">
        {s.icon}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-sm font-semibold ${s.text}`}>{rule.title}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${s.badge}`}>{s.label}</span>
          </div>
          <p className={`text-xs leading-relaxed ${s.sub}`}>{rule.description}</p>
          {rule.recommendation && (
            <p className={`text-xs mt-1.5 ${s.sub} opacity-80`}>
              <span className="font-semibold">→</span> {rule.recommendation}
            </p>
          )}
          {rule.officialLink && (
            <a href={rule.officialLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-xs text-blue-600 hover:underline mt-1.5">
              Official source <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function RuleSection({ label, rules, color }: { label: string; rules: ComplianceRule[]; color: string }) {
  if (!rules.length) return null;
  return (
    <div className="space-y-2">
      <p className={`text-xs font-bold uppercase tracking-wide ${color}`}>{label} ({rules.length})</p>
      {rules.map(r => <RuleCard key={r.id} rule={r} />)}
    </div>
  );
}

export function ResultsStep({ result, address, onRestart, onRetake }: Props) {
  const s = STATUS[result.overallStatus];
  const fails   = result.rules.filter(r => r.severity === 'fail');
  const warns   = result.rules.filter(r => r.severity === 'warning');
  const passes  = result.rules.filter(r => r.severity === 'pass');
  const infos   = result.rules.filter(r => r.severity === 'info');

  return (
    <div className="space-y-5">
      {/* Score header */}
      <div className={`p-5 rounded-2xl border-2 ${s.bg} ${s.border}`}>
        <div className="flex items-center gap-4">
          <ScoreRing score={result.score} size={88} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-xl font-bold text-slate-900">{result.cityName}</h2>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.badge}`}>{s.label}</span>
            </div>
            {address && <p className="text-xs text-slate-500 mb-1 truncate">{address}</p>}
            <p className={`text-sm ${s.text}`}>{s.desc}</p>
            <div className="mt-2">
              <DataBadge source={result.dataSource} scrapedAt={result.scrapedAt} lastUpdated={result.lastUpdated} />
            </div>
          </div>
        </div>
      </div>

      {/* Registration CTA */}
      {result.registrationRequired && (
        <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex-wrap">
          <div>
            <p className="font-semibold text-slate-900 text-sm">Permit / Registration Required</p>
            <p className="text-xs text-slate-500 mt-0.5">{result.registrationFee}</p>
          </div>
          <a href={result.registrationLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold flex-shrink-0">
            Apply Now <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Compliance checks */}
      <div className="space-y-4">
        <RuleSection label="Issues"   rules={fails}  color="text-red-600" />
        <RuleSection label="Warnings" rules={warns}  color="text-amber-600" />
        <RuleSection label="Passing"  rules={passes} color="text-emerald-600" />
        <RuleSection label="Info"     rules={infos}  color="text-blue-600" />
      </div>

      {/* All requirements expandable */}
      {result.keyRequirements.length > 0 && (
        <details className="group">
          <summary className="flex items-center gap-2 cursor-pointer list-none text-sm font-semibold text-slate-700 hover:text-slate-900 py-2">
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
            All {result.cityName} Regulations ({result.keyRequirements.length})
          </summary>
          <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            {result.keyRequirements.map((r, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  r.severity === 'required' ? 'bg-red-500' :
                  r.severity === 'conditional' ? 'bg-amber-500' :
                  r.severity === 'prohibited' ? 'bg-red-700' : 'bg-blue-400'
                }`} />
                <div>
                  <p className="text-xs font-semibold text-slate-800">{r.title}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Tax info */}
      {result.taxes.length > 0 && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-xs font-semibold text-blue-800 mb-1">Tax Obligations</p>
          {result.taxes.map((t, i) => <p key={i} className="text-xs text-blue-700">{t}</p>)}
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-3 bg-slate-100 rounded-xl">
        <p className="text-xs text-slate-500 leading-relaxed">
          <span className="font-semibold">Disclaimer:</span> This tool provides general information based on
          publicly available regulations as of 2026 and is not legal advice. Regulations change frequently —
          always verify with official city portals and consult a licensed attorney before listing.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onRetake}
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-sm font-semibold">
          <RefreshCw className="w-4 h-4" /> Retake
        </button>
        <button onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold">
          <RotateCcw className="w-4 h-4" /> New Check
        </button>
      </div>
    </div>
  );
}
