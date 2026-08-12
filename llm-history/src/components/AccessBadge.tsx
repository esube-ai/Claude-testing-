import type { Access } from "../data/types";

const LABELS: Record<Access, string> = {
  "open-weight": "Open weight",
  closed: "Closed",
  research: "Research",
};

const DOT: Record<Access, string> = {
  "open-weight": "var(--status-good)",
  closed: "var(--text-muted)",
  research: "var(--series-4)",
};

export default function AccessBadge({ access }: { access: Access }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-2 py-0.5 text-xs font-medium text-ink-secondary whitespace-nowrap">
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ background: DOT[access] }}
      />
      {LABELS[access]}
    </span>
  );
}
