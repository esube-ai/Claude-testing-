import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import type { LLMModel } from "../data/types";
import { ERAS } from "../data/eras";
import {
  TIMELINE_START,
  TIMELINE_END,
  daysBetween,
  formatDate,
} from "../data/derive";

const PX_PER_DAY = 2.6;
const LANES = 5;
const LANE_HEIGHT = 84;
const TOP_PADDING = 48;
const BOTTOM_PADDING = 24;
const MIN_GAP_DAYS = 16;

interface LaneItem {
  model: LLMModel;
  x: number;
  lane: number;
}

function assignLanes(models: LLMModel[]): LaneItem[] {
  const laneEndX = new Array(LANES).fill(-Infinity);
  const items: LaneItem[] = [];
  for (const model of models) {
    const x = daysBetween(TIMELINE_START, model.releaseDate) * PX_PER_DAY;
    const minGapPx = MIN_GAP_DAYS * PX_PER_DAY;
    let lane = laneEndX.findIndex((end) => x - end >= minGapPx);
    if (lane === -1) {
      lane = laneEndX.indexOf(Math.min(...laneEndX));
    }
    laneEndX[lane] = x;
    items.push({ model, x, lane });
  }
  return items;
}

export default function Timeline({ models }: { models: LLMModel[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => assignLanes(models), [models]);
  const totalWidth = useMemo(
    () => daysBetween(TIMELINE_START, TIMELINE_END) * PX_PER_DAY,
    [],
  );
  const height = LANES * LANE_HEIGHT + TOP_PADDING + BOTTOM_PADDING;

  const years = useMemo(() => {
    const startYear = new Date(TIMELINE_START).getUTCFullYear();
    const endYear = new Date(TIMELINE_END).getUTCFullYear();
    const list: { year: number; x: number }[] = [];
    for (let y = startYear; y <= endYear; y++) {
      list.push({
        year: y,
        x: daysBetween(TIMELINE_START, `${y}-01-01`) * PX_PER_DAY,
      });
    }
    return list;
  }, []);

  function scrollToEra(start: string) {
    const el = scrollRef.current;
    if (!el) return;
    const x = daysBetween(TIMELINE_START, start) * PX_PER_DAY;
    el.scrollTo({ left: Math.max(x - 24, 0), behavior: "smooth" });
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap gap-2">
        {ERAS.map((era) => (
          <button
            key={era.id}
            type="button"
            onClick={() => scrollToEra(era.start)}
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:text-ink"
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: era.colorVar }}
            />
            {era.label}
          </button>
        ))}
      </div>

      <div
        ref={scrollRef}
        className="relative w-full overflow-x-auto overflow-y-hidden rounded-xl border border-hairline bg-card"
        role="group"
        aria-label="Interactive timeline of LLM releases, scroll horizontally to explore"
      >
        <div className="relative" style={{ width: totalWidth, height }}>
          {ERAS.map((era) => {
            const x1 = daysBetween(TIMELINE_START, era.start) * PX_PER_DAY;
            const x2 = daysBetween(TIMELINE_START, era.end) * PX_PER_DAY;
            return (
              <div
                key={era.id}
                className="absolute top-0 bottom-0"
                style={{
                  left: x1,
                  width: x2 - x1,
                  background: `color-mix(in oklab, ${era.colorVar} 10%, transparent)`,
                  borderRight: "1px solid var(--gridline)",
                }}
              >
                <span
                  className="sticky left-2 top-2 z-10 inline-block rounded-full px-2 py-1 text-[11px] font-semibold whitespace-nowrap"
                  style={{
                    color: era.colorVar,
                    background: "color-mix(in oklab, var(--surface-page) 70%, transparent)",
                  }}
                >
                  {era.label} · {era.range}
                </span>
              </div>
            );
          })}

          {years.map(({ year, x }) => (
            <div
              key={year}
              className="absolute top-0 bottom-0 border-l border-gridline"
              style={{ left: x }}
            >
              <span className="absolute bottom-1 left-1.5 text-[11px] font-medium tabular-nums text-ink-muted">
                {year}
              </span>
            </div>
          ))}

          {items.map(({ model, x, lane }) => (
            <Link
              key={model.slug}
              to={`/models/${model.slug}`}
              className="group absolute flex -translate-x-1/2 flex-col items-center focus-visible:z-30 focus-visible:outline-none"
              style={{
                left: x,
                top: TOP_PADDING + lane * LANE_HEIGHT,
              }}
              aria-label={`${model.name} by ${model.org}, released ${formatDate(model.releaseDate)}`}
            >
              <span
                className="block h-3.5 w-3.5 rounded-full ring-2 ring-card transition-transform group-hover:scale-125 group-focus-visible:scale-125"
                style={{ background: `var(--series-${eraSlot(model.era)})` }}
              />
              <span className="mt-1.5 max-w-[110px] text-center text-[11px] leading-tight font-medium text-ink-secondary group-hover:text-ink">
                {model.name}
              </span>

              <div className="pointer-events-none absolute top-full z-20 mt-2 hidden w-56 -translate-x-1/2 translate-y-1 rounded-lg border border-hairline bg-card p-3 text-left opacity-0 shadow-lg transition-opacity duration-150 group-hover:block group-hover:opacity-100 group-focus-visible:block group-focus-visible:opacity-100">
                <p className="text-xs font-medium tabular-nums text-ink-muted">
                  {formatDate(model.releaseDate)} · {model.org}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">{model.name}</p>
                <p className="mt-1 line-clamp-3 text-xs text-ink-secondary">
                  {model.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs text-ink-muted sm:hidden">
        Swipe to explore the full timeline.
      </p>
    </div>
  );
}

function eraSlot(era: LLMModel["era"]): number {
  const order = [
    "foundations",
    "scaling",
    "alignment",
    "llm-race",
    "multimodal",
    "reasoning",
    "frontier-2026",
  ];
  return order.indexOf(era) + 1;
}
