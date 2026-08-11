export type Era =
  | "foundations"
  | "scaling"
  | "alignment"
  | "llm-race"
  | "multimodal"
  | "reasoning"
  | "frontier-2026";

export type Access = "open-weight" | "closed" | "research";

export interface LinkRef {
  label: string;
  url: string;
}

export interface LLMModel {
  slug: string;
  name: string;
  org: string;
  family: string;
  releaseDate: string; // ISO yyyy-mm-dd
  era: Era;
  access: Access;
  modality: string[];
  parameters?: string;
  contextWindow?: string;
  summary: string;
  significance: string;
  keyFeatures: string[];
  links?: LinkRef[];
}

export interface EraInfo {
  id: Era;
  label: string;
  range: string;
  start: string; // ISO date, inclusive
  end: string; // ISO date, exclusive
  colorVar: string;
  description: string;
}
