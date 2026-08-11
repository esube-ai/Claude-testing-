import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  getModelBySlug,
  getAdjacent,
  getFamilyLineage,
  familyLabel,
  formatDate,
} from "../data/derive";
import { ERA_MAP } from "../data/eras";
import EraBadge from "../components/EraBadge";
import AccessBadge from "../components/AccessBadge";

export default function ModelDetailPage() {
  const { slug = "" } = useParams();
  const model = getModelBySlug(slug);

  useEffect(() => {
    if (model) document.title = `${model.name} — History of LLMs`;
    return () => {
      document.title = "History of LLMs — An Interactive Timeline";
    };
  }, [model]);

  if (!model) return <Navigate to="/models" replace />;

  const { prev, next } = getAdjacent(model.slug);
  const lineage = getFamilyLineage(model).filter((m) => m.slug !== model.slug);
  const era = ERA_MAP[model.era];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <nav className="text-sm text-ink-muted" aria-label="Breadcrumb">
        <Link to="/models" className="hover:text-ink-secondary">
          All models
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-secondary">{model.name}</span>
      </nav>

      <header className="mt-4 animate-fade-in">
        <div className="flex flex-wrap items-center gap-2">
          <EraBadge era={model.era} size="md" />
          <AccessBadge access={model.access} />
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {model.name}
        </h1>
        <p className="mt-2 text-base text-ink-secondary">
          {model.org} · Released {formatDate(model.releaseDate)}
        </p>
        <p className="mt-5 max-w-2xl text-lg text-ink-secondary">{model.summary}</p>
      </header>

      <dl className="mt-8 grid grid-cols-2 gap-4 rounded-xl border border-hairline bg-card p-5 sm:grid-cols-4">
        <div>
          <dt className="text-xs font-medium tracking-wide text-ink-muted uppercase">Parameters</dt>
          <dd className="mt-1 text-sm font-semibold text-ink">{model.parameters ?? "Undisclosed"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium tracking-wide text-ink-muted uppercase">Context window</dt>
          <dd className="mt-1 text-sm font-semibold text-ink">{model.contextWindow ?? "Undisclosed"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium tracking-wide text-ink-muted uppercase">Modality</dt>
          <dd className="mt-1 text-sm font-semibold text-ink capitalize">{model.modality.join(", ")}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium tracking-wide text-ink-muted uppercase">Family</dt>
          <dd className="mt-1 text-sm font-semibold text-ink">{familyLabel(model.family)}</dd>
        </div>
      </dl>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">Why it mattered</h2>
        <p className="mt-3 text-ink-secondary">{model.significance}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">Key features</h2>
        <ul className="mt-3 space-y-2">
          {model.keyFeatures.map((f) => (
            <li key={f} className="flex gap-2.5 text-ink-secondary">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </section>

      {model.links && model.links.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ink">Further reading</h2>
          <ul className="mt-3 space-y-2">
            {model.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-accent hover:underline"
                >
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {lineage.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-ink">
            {familyLabel(model.family)} lineage
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {lineage.map((m) => (
              <Link
                key={m.slug}
                to={`/models/${m.slug}`}
                className="rounded-full border border-hairline px-3 py-1.5 text-sm text-ink-secondary transition-colors hover:border-accent hover:text-ink"
              >
                {m.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 rounded-xl border border-hairline bg-card p-5">
        <p className="text-sm text-ink-secondary">
          Part of the{" "}
          <Link to={`/models?era=${era.id}`} className="font-semibold text-accent hover:underline">
            {era.label}
          </Link>{" "}
          era ({era.range}). {era.description}
        </p>
      </section>

      <nav className="mt-10 grid grid-cols-1 gap-3 border-t border-hairline pt-8 sm:grid-cols-2">
        {prev ? (
          <Link
            to={`/models/${prev.slug}`}
            className="rounded-xl border border-hairline p-4 transition-colors hover:bg-card"
          >
            <p className="text-xs font-medium text-ink-muted">← Previous</p>
            <p className="mt-1 font-semibold text-ink">{prev.name}</p>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            to={`/models/${next.slug}`}
            className="rounded-xl border border-hairline p-4 text-right transition-colors hover:bg-card"
          >
            <p className="text-xs font-medium text-ink-muted">Next →</p>
            <p className="mt-1 font-semibold text-ink">{next.name}</p>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
