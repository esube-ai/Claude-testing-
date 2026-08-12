import { Link } from "react-router-dom";
import { MODELS } from "../data/models";
import { ERAS } from "../data/eras";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        About this project
      </h1>
      <p className="mt-5 text-ink-secondary">
        <strong className="text-ink">History of LLMs</strong> is an independent,
        continuously updated reference tracking large language models from the
        2017 Transformer paper through today's frontier releases. It exists
        because the pace of this field makes it easy to lose track of what
        happened when — and why it mattered at the time.
      </p>
      <p className="mt-4 text-ink-secondary">
        The dataset currently covers {MODELS.length} models across{" "}
        {new Set(MODELS.map((m) => m.org)).size} labs and organizations, split
        into seven eras that roughly follow how the field's priorities shifted
        over time.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-ink">The seven eras</h2>
      <div className="mt-4 space-y-4">
        {ERAS.map((era) => (
          <div key={era.id} className="rounded-xl border border-hairline bg-card p-4">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: era.colorVar }}
              />
              <h3 className="font-semibold text-ink">
                {era.label} <span className="font-normal text-ink-muted">· {era.range}</span>
              </h3>
            </div>
            <p className="mt-2 text-sm text-ink-secondary">{era.description}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-semibold text-ink">Sources & accuracy</h2>
      <p className="mt-3 text-ink-secondary">
        Entries are compiled from labs' own announcements, technical reports, and
        papers. Parameter counts and context windows are self-reported by each
        organization — many closed frontier models don't disclose parameter
        counts at all, and figures for the newest releases can be revised as
        more official detail becomes available. If you spot something outdated
        or incorrect, treat this as a living document rather than a final
        record: the field moves fast enough that any snapshot starts aging the
        day it's published.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-ink">Explore</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          to="/timeline"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          View the timeline
        </Link>
        <Link
          to="/models"
          className="rounded-full border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-card"
        >
          Browse all models
        </Link>
      </div>
    </div>
  );
}
