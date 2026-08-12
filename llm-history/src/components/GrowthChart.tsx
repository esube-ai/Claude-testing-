import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { LLMModel } from "../data/types";
import { TIMELINE_START, TIMELINE_END, daysBetween, formatDate } from "../data/derive";

export interface GrowthPoint {
  model: LLMModel;
  value: number;
}

export default function GrowthChart({
  points,
  yTicks,
  formatY,
  colorVar,
  valueLabel,
}: {
  points: GrowthPoint[];
  yTicks: number[];
  formatY: (n: number) => string;
  colorVar: string;
  valueLabel: string;
}) {
  const minY = yTicks[0];
  const maxY = yTicks[yTicks.length - 1];
  const totalDays = useMemo(
    () => daysBetween(TIMELINE_START, TIMELINE_END),
    [],
  );

  const years = useMemo(() => {
    const startYear = new Date(TIMELINE_START).getUTCFullYear();
    const endYear = new Date(TIMELINE_END).getUTCFullYear();
    const list: { year: number; pct: number }[] = [];
    for (let y = startYear; y <= endYear; y += 1) {
      list.push({
        year: y,
        pct: (daysBetween(TIMELINE_START, `${y}-01-01`) / totalDays) * 100,
      });
    }
    return list;
  }, [totalDays]);

  function yPct(value: number) {
    const t =
      (Math.log10(value) - Math.log10(minY)) /
      (Math.log10(maxY) - Math.log10(minY));
    return Math.min(97, Math.max(3, t * 100));
  }

  function xPct(date: string) {
    return Math.min(100, Math.max(0, (daysBetween(TIMELINE_START, date) / totalDays) * 100));
  }

  return (
    <div className="relative aspect-[4/3] w-full rounded-xl border border-hairline bg-card p-4 sm:aspect-[16/9]">
      {/* plot area: fixed margins reserved for axis labels, everything below is relative to THIS box */}
      <div className="absolute top-2 right-2 bottom-7 left-11 sm:left-14">
        {yTicks.map((tick) => (
          <div
            key={tick}
            className="absolute inset-x-0 border-t border-gridline"
            style={{ bottom: `${yPct(tick)}%` }}
          >
            <span className="absolute -left-11 -translate-y-1/2 text-[10px] tabular-nums text-ink-muted sm:-left-14 sm:text-xs">
              {formatY(tick)}
            </span>
          </div>
        ))}

        {years.map(({ year, pct }) => (
          <span
            key={year}
            className="absolute top-full mt-1.5 -translate-x-1/2 text-[10px] tabular-nums text-ink-muted sm:text-xs"
            style={{ left: `${pct}%` }}
          >
            {year}
          </span>
        ))}

        {points.map(({ model, value }) => (
          <Link
            key={model.slug}
            to={`/models/${model.slug}`}
            className="group absolute block h-6 w-6 -translate-x-1/2 translate-y-1/2 focus-visible:z-20 focus-visible:outline-none"
            style={{ left: `${xPct(model.releaseDate)}%`, bottom: `${yPct(value)}%` }}
            aria-label={`${model.name}: ${formatY(value)} ${valueLabel}, ${formatDate(model.releaseDate)}`}
          >
            <span
              className="absolute top-1/2 left-1/2 block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card transition-transform group-hover:scale-150 group-focus-visible:scale-150"
              style={{ background: colorVar }}
            />
            <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-52 -translate-x-1/2 rounded-lg border border-hairline bg-card p-3 text-left opacity-0 shadow-lg transition-opacity duration-150 group-hover:block group-hover:opacity-100 group-focus-visible:block group-focus-visible:opacity-100">
              <p className="text-xs font-medium tabular-nums text-ink-muted">
                {formatDate(model.releaseDate)}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-ink">{model.name}</p>
              <p className="mt-0.5 text-xs text-ink-secondary">
                {valueLabel}: <span className="font-medium text-ink">{formatY(value)}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
