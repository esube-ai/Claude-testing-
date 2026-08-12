import { Link } from "react-router-dom";
import type { LLMModel } from "../data/types";
import { formatDateShort } from "../data/derive";
import EraBadge from "./EraBadge";
import AccessBadge from "./AccessBadge";

export default function ModelCard({ model }: { model: LLMModel }) {
  return (
    <Link
      to={`/models/${model.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-hairline bg-card p-4 transition-colors hover:bg-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent sm:p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium tabular-nums text-ink-muted">
            {formatDateShort(model.releaseDate)}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-ink group-hover:text-accent">
            {model.name}
          </h3>
          <p className="text-sm text-ink-secondary">{model.org}</p>
        </div>
      </div>
      <p className="line-clamp-2 text-sm text-ink-secondary">{model.summary}</p>
      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
        <EraBadge era={model.era} />
        <AccessBadge access={model.access} />
      </div>
    </Link>
  );
}
