import { Wifi, Database, AlertCircle, RefreshCw } from 'lucide-react';
import type { DataSource } from '../types';

interface Props { source: DataSource; scrapedAt: string | null; lastUpdated: string }

const CONFIG: Record<DataSource, { label: string; color: string; icon: typeof Wifi }> = {
  live:          { label: 'Live data',       color: 'bg-emerald-100 text-emerald-700', icon: Wifi },
  scraped:       { label: 'Recently scraped', color: 'bg-blue-100 text-blue-700',      icon: RefreshCw },
  seeded:        { label: 'Research data',    color: 'bg-slate-100 text-slate-600',    icon: Database },
  scrape_failed: { label: 'Scrape pending',   color: 'bg-amber-100 text-amber-700',    icon: AlertCircle },
};

export function DataBadge({ source, scrapedAt, lastUpdated }: Props) {
  const cfg = CONFIG[source] ?? CONFIG.seeded;
  const Icon = cfg.icon;
  const date = scrapedAt
    ? new Date(scrapedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : `Verified ${lastUpdated}`;

  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label} · {date}
    </span>
  );
}
