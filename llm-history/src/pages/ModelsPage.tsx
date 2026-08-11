import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MODELS } from "../data/models";
import { MODELS_BY_DATE, ORGS } from "../data/derive";
import { ERAS } from "../data/eras";
import ModelCard from "../components/ModelCard";
import type { Access, Era } from "../data/types";

export default function ModelsPage() {
  const [params, setParams] = useSearchParams();
  const activeEra = (params.get("era") as Era | null) ?? "";
  const [query, setQuery] = useState("");
  const [org, setOrg] = useState("");
  const [access, setAccess] = useState<Access | "">("");
  const [sort, setSort] = useState<"newest" | "oldest" | "name">("newest");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = MODELS.filter((m) => {
      if (activeEra && m.era !== activeEra) return false;
      if (org && m.org !== org) return false;
      if (access && m.access !== access) return false;
      if (
        q &&
        !(
          m.name.toLowerCase().includes(q) ||
          m.org.toLowerCase().includes(q) ||
          m.summary.toLowerCase().includes(q)
        )
      )
        return false;
      return true;
    });
    if (sort === "newest") list = [...list].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
    else if (sort === "oldest") list = [...list].sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
    else list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [query, org, access, sort, activeEra]);

  function setEra(era: string) {
    if (era) setParams({ era });
    else setParams({});
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        All models
      </h1>
      <p className="mt-2 text-sm text-ink-secondary sm:text-base">
        {results.length} of {MODELS_BY_DATE.length} models
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search models, organizations, or keywords…"
          className="w-full rounded-lg border border-hairline bg-card px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
          aria-label="Search models"
        />

        <div className="flex flex-wrap gap-2">
          <select
            value={activeEra}
            onChange={(e) => setEra(e.target.value)}
            className="rounded-lg border border-hairline bg-card px-3 py-2 text-sm text-ink-secondary focus:border-accent focus:outline-none"
            aria-label="Filter by era"
          >
            <option value="">All eras</option>
            {ERAS.map((era) => (
              <option key={era.id} value={era.id}>
                {era.label} ({era.range})
              </option>
            ))}
          </select>

          <select
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            className="rounded-lg border border-hairline bg-card px-3 py-2 text-sm text-ink-secondary focus:border-accent focus:outline-none"
            aria-label="Filter by organization"
          >
            <option value="">All organizations</option>
            {ORGS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>

          <select
            value={access}
            onChange={(e) => setAccess(e.target.value as Access | "")}
            className="rounded-lg border border-hairline bg-card px-3 py-2 text-sm text-ink-secondary focus:border-accent focus:outline-none"
            aria-label="Filter by access type"
          >
            <option value="">Any access</option>
            <option value="open-weight">Open weight</option>
            <option value="closed">Closed</option>
            <option value="research">Research</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="ml-auto rounded-lg border border-hairline bg-card px-3 py-2 text-sm text-ink-secondary focus:border-accent focus:outline-none"
            aria-label="Sort order"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="mt-16 text-center text-sm text-ink-muted">
          No models match your filters. Try clearing the search or filters above.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((model) => (
            <ModelCard key={model.slug} model={model} />
          ))}
        </div>
      )}
    </div>
  );
}
