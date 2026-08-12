import { Link } from "react-router-dom";
import { MODELS } from "../data/models";
import { MODELS_BY_DATE } from "../data/derive";
import { ERAS } from "../data/eras";
import Timeline from "../components/Timeline";
import ModelCard from "../components/ModelCard";
import StatTile from "../components/StatTile";

export default function HomePage() {
  const latest = [...MODELS_BY_DATE].reverse().slice(0, 6);
  const orgCount = new Set(MODELS.map((m) => m.org)).size;
  const openWeightCount = MODELS.filter((m) => m.access === "open-weight").length;

  return (
    <div className="animate-fade-in">
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            Updated through August 2026
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
            The history of large language models, one release at a time.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-ink-secondary sm:text-lg">
            From the 2017 Transformer paper to today's frontier reasoning models —
            an interactive, continuously updated record of every model that moved
            the field forward. Explore the timeline, compare how fast context
            windows and parameter counts have grown, and read a dedicated page on
            every model.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/timeline"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Explore the timeline
            </Link>
            <Link
              to="/models"
              className="rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-card"
            >
              Browse all models
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile value={String(MODELS.length)} label="Models tracked" />
            <StatTile value={String(orgCount)} label="Labs & organizations" />
            <StatTile value={String(openWeightCount)} label="Open-weight releases" />
            <StatTile value="2017–2026" label="Years covered" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-ink">The full timeline</h2>
            <p className="mt-1 text-sm text-ink-secondary">
              Every model, positioned by release date. Scroll horizontally, or jump to an era.
            </p>
          </div>
          <Link to="/timeline" className="text-sm font-semibold text-accent hover:underline">
            Open full timeline →
          </Link>
        </div>
        <div className="mt-6">
          <Timeline models={MODELS} />
        </div>
      </section>

      <section className="border-t border-hairline bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h2 className="text-2xl font-semibold text-ink">Seven eras</h2>
          <p className="mt-1 max-w-2xl text-sm text-ink-secondary">
            The field's progress splits naturally into distinct chapters — each one
            defined by a shift in what labs were optimizing for.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ERAS.map((era) => (
              <Link
                key={era.id}
                to={`/models?era=${era.id}`}
                className="group flex flex-col gap-2 rounded-xl border border-hairline bg-card p-5 transition-colors hover:bg-card-hover"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: era.colorVar }}
                  />
                  <span className="text-xs font-semibold tabular-nums text-ink-muted">
                    {era.range}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-ink group-hover:text-accent">
                  {era.label}
                </h3>
                <p className="text-sm text-ink-secondary">{era.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Latest releases</h2>
            <p className="mt-1 text-sm text-ink-secondary">
              The six most recent models added to the record.
            </p>
          </div>
          <Link to="/models" className="text-sm font-semibold text-accent hover:underline">
            View all {MODELS.length} models →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((model) => (
            <ModelCard key={model.slug} model={model} />
          ))}
        </div>
      </section>

      <section className="border-t border-hairline">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="rounded-2xl border border-hairline bg-card p-6 sm:p-10">
            <h2 className="text-2xl font-semibold text-ink">
              How fast has this moved?
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-secondary">
              Context windows grew from 512 tokens to 10 million. Parameter counts
              grew from millions to trillions. See both on a log scale.
            </p>
            <Link
              to="/growth"
              className="mt-5 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              See the growth charts →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
