import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MODELS } from "../data/models";
import { ERAS } from "../data/eras";
import { MODELS_BY_DATE, formatDate } from "../data/derive";
import Timeline from "../components/Timeline";
import EraBadge from "../components/EraBadge";
import { Link } from "react-router-dom";
import type { Era } from "../data/types";

export default function TimelinePage() {
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState<"timeline" | "list">("timeline");
  const activeEra = params.get("era") as Era | null;

  const filtered = useMemo(() => {
    const models = activeEra ? MODELS.filter((m) => m.era === activeEra) : MODELS;
    return [...models].sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
  }, [activeEra]);

  function setEra(era: Era | null) {
    if (era) setParams({ era });
    else setParams({});
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Timeline
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-secondary sm:text-base">
        {MODELS_BY_DATE.length} models from {formatDate(MODELS_BY_DATE[0].releaseDate)}{" "}
        to {formatDate(MODELS_BY_DATE[MODELS_BY_DATE.length - 1].releaseDate)}.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setEra(null)}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
            !activeEra
              ? "border-accent bg-accent text-white"
              : "border-hairline text-ink-secondary hover:text-ink"
          }`}
        >
          All eras
        </button>
        {ERAS.map((era) => (
          <button
            key={era.id}
            type="button"
            onClick={() => setEra(era.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeEra === era.id
                ? "text-white"
                : "border-hairline text-ink-secondary hover:text-ink"
            }`}
            style={
              activeEra === era.id
                ? { background: era.colorVar, borderColor: era.colorVar }
                : undefined
            }
          >
            {era.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-1 rounded-full border border-hairline p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setView("timeline")}
            className={`rounded-full px-3 py-1 ${view === "timeline" ? "bg-accent text-white" : "text-ink-secondary"}`}
          >
            Timeline
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`rounded-full px-3 py-1 ${view === "list" ? "bg-accent text-white" : "text-ink-secondary"}`}
          >
            List
          </button>
        </div>
      </div>

      <div className="mt-6">
        {view === "timeline" ? (
          <Timeline models={filtered} />
        ) : (
          <div className="overflow-hidden rounded-xl border border-hairline">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-hairline bg-card text-left text-xs text-ink-muted uppercase">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Model</th>
                  <th className="px-4 py-3 font-semibold">Organization</th>
                  <th className="hidden px-4 py-3 font-semibold sm:table-cell">Era</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((model) => (
                  <tr key={model.slug} className="border-b border-hairline last:border-0 odd:bg-card/40">
                    <td className="px-4 py-3 whitespace-nowrap tabular-nums text-ink-muted">
                      {formatDate(model.releaseDate)}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      <Link to={`/models/${model.slug}`} className="text-ink hover:text-accent">
                        {model.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink-secondary">{model.org}</td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <EraBadge era={model.era} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
