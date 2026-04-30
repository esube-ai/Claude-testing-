import { ExternalLink, Shield, Calendar, Users, DollarSign, Home, AlertTriangle } from 'lucide-react';
import type { CityData } from '../types';
import { DataBadge } from './DataBadge';

interface Props { city: CityData }

const SEV_COLOR: Record<string, string> = {
  required: 'border-l-red-500',
  conditional: 'border-l-amber-500',
  info: 'border-l-blue-500',
  prohibited: 'border-l-red-700',
};

function Stat({ icon: Icon, label, value }: { icon: typeof Shield; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-xs text-slate-500 leading-none mb-0.5">{label}</p>
        <p className="text-sm font-medium text-slate-800 leading-snug">{value}</p>
      </div>
    </div>
  );
}

export function CityInfoPanel({ city }: Props) {
  const rules = city.regulationRules ?? [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-slate-900 text-base">{city.name}, {city.state}</h3>
          <p className="text-xs text-slate-500 mt-0.5">Regulation reference</p>
        </div>
        <DataBadge source={city.scrapeStatus} scrapedAt={city.scrapedAt} lastUpdated={city.lastUpdated} />
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 gap-3">
        <Stat icon={Shield} label="Permit Required" value={city.permitRequired ? 'Yes' : 'No'} />
        <Stat icon={DollarSign} label="Permit Fee" value={city.permitFee} />
        <Stat icon={Home} label="Primary Residence" value={city.primaryResidenceRequired ? 'Required' : 'Not required'} />
        {city.unhostedDayLimit !== null && (
          <Stat icon={Calendar} label="Unhosted Day Cap" value={city.unhostedDayLimit === 0 ? 'Not allowed' : `${city.unhostedDayLimit} days/yr`} />
        )}
        {city.hostedDayLimit !== null && (
          <Stat icon={Calendar} label="Hosted Day Cap" value={`${city.hostedDayLimit} days/yr`} />
        )}
        {city.maxGuests !== null && (
          <Stat icon={Users} label="Max Guests" value={`${city.maxGuests} at one time`} />
        )}
        {city.taxRate !== null && (
          <Stat icon={DollarSign} label="Occupancy Tax" value={`${city.taxRate}%`} />
        )}
        {city.maxBedrooms !== null && (
          <Stat icon={Home} label="Max Bedrooms" value={`${city.maxBedrooms} rooms`} />
        )}
      </div>

      {/* Insurance */}
      {city.liabilityInsuranceRequired && (
        <div className="flex items-start gap-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            <span className="font-semibold">Insurance required:</span>{' '}
            ${city.liabilityInsuranceMin?.toLocaleString()} minimum liability coverage
          </p>
        </div>
      )}

      {/* Regulation rules from DB */}
      {rules.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Regulations ({rules.length})
          </p>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {rules.map(r => (
              <div key={r.id} className={`pl-3 border-l-4 ${SEV_COLOR[r.severity] ?? 'border-l-slate-300'}`}>
                <p className="text-xs font-semibold text-slate-800">{r.title}</p>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{r.rule_text}</p>
                {r.source_url && (
                  <a href={r.source_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-xs text-blue-600 hover:underline mt-0.5">
                    Source <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official link */}
      <a href={city.permitLink} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 w-full py-2 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-xs font-medium">
        Official {city.name} STR Portal <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
