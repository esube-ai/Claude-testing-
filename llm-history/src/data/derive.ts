import { MODELS } from "./models";
import type { LLMModel } from "./types";

export const MODELS_BY_DATE: LLMModel[] = [...MODELS].sort((a, b) =>
  a.releaseDate.localeCompare(b.releaseDate),
);

const bySlug = new Map(MODELS.map((m) => [m.slug, m]));

export function getModelBySlug(slug: string): LLMModel | undefined {
  return bySlug.get(slug);
}

export function getAdjacent(slug: string): {
  prev: LLMModel | null;
  next: LLMModel | null;
} {
  const idx = MODELS_BY_DATE.findIndex((m) => m.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? MODELS_BY_DATE[idx - 1] : null,
    next: idx < MODELS_BY_DATE.length - 1 ? MODELS_BY_DATE[idx + 1] : null,
  };
}

export function getFamilyLineage(model: LLMModel): LLMModel[] {
  return MODELS_BY_DATE.filter((m) => m.family === model.family);
}

const FAMILY_LABELS: Record<string, string> = {
  gpt: "GPT / OpenAI",
  claude: "Claude",
  gemini: "Gemini / PaLM",
  llama: "Llama",
  mistral: "Mistral",
  deepseek: "DeepSeek",
  qwen: "Qwen",
  grok: "Grok",
  bert: "BERT",
  t5: "T5",
  other: "Other",
};

export function familyLabel(family: string): string {
  return FAMILY_LABELS[family] ?? family;
}

/** Largest parameter figure mentioned, in billions. Returns null if undisclosed. */
export function parseParamsB(model: LLMModel): number | null {
  const s = model.parameters;
  if (!s) return null;
  const matches = [...s.matchAll(/([\d.]+)\s*(B|T)\b/g)];
  if (matches.length === 0) return null;
  const values = matches.map(
    ([, num, unit]) => parseFloat(num) * (unit === "T" ? 1000 : 1),
  );
  return Math.max(...values);
}

/** Largest context-window figure mentioned, in tokens. Returns null if undisclosed. */
export function parseContextTokens(model: LLMModel): number | null {
  const s = model.contextWindow;
  if (!s) return null;
  const matches = [...s.matchAll(/([\d,]+)\s*tokens/g)];
  if (matches.length === 0) return null;
  const values = matches.map((m) => parseInt(m[1].replace(/,/g, ""), 10));
  return Math.max(...values);
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateShort(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export const ORGS: string[] = Array.from(new Set(MODELS.map((m) => m.org))).sort();
export const FAMILIES: string[] = Array.from(new Set(MODELS.map((m) => m.family)));

export function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function daysBetween(a: string, b: string): number {
  return (isoToDate(b).getTime() - isoToDate(a).getTime()) / 86_400_000;
}

export const TIMELINE_START = "2017-01-01";
export const TIMELINE_END = "2027-01-01";

export function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000) return `${n / 1_000}K`;
  return `${n}`;
}

export function formatParamsB(n: number): string {
  if (n >= 1000) return `${n / 1000}T`;
  return `${n}B`;
}
