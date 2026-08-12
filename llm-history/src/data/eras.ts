import type { EraInfo } from "./types";

export const ERAS: EraInfo[] = [
  {
    id: "foundations",
    label: "Foundations",
    range: "2017–2018",
    start: "2017-01-01",
    end: "2019-01-01",
    colorVar: "var(--series-1)",
    description:
      "The Transformer architecture arrives and the first wave of pretrained language models proves that scale plus self-supervision beats hand-built pipelines.",
  },
  {
    id: "scaling",
    label: "Scaling Up",
    range: "2019–2020",
    start: "2019-01-01",
    end: "2021-01-01",
    colorVar: "var(--series-2)",
    description:
      "Labs discover that bigger models trained on more text keep getting better, culminating in GPT-3's 175-billion-parameter leap.",
  },
  {
    id: "alignment",
    label: "Alignment & Assistants",
    range: "2021–2022",
    start: "2021-01-01",
    end: "2023-01-01",
    colorVar: "var(--series-3)",
    description:
      "Research shifts toward making models useful and steerable — instruction tuning, RLHF, and scaling laws — ending with ChatGPT's public debut.",
  },
  {
    id: "llm-race",
    label: "The LLM Race",
    range: "2023",
    start: "2023-01-01",
    end: "2024-01-01",
    colorVar: "var(--series-4)",
    description:
      "ChatGPT's breakout triggers an industry-wide sprint: GPT-4, Claude, Llama, PaLM 2, and Gemini all launch within months of each other.",
  },
  {
    id: "multimodal",
    label: "Multimodal & Open Models",
    range: "2024",
    start: "2024-01-01",
    end: "2025-01-01",
    colorVar: "var(--series-5)",
    description:
      "Vision, audio, and huge context windows become standard, open-weight models close the gap with frontier labs, and the first reasoning model appears.",
  },
  {
    id: "reasoning",
    label: "The Reasoning Era",
    range: "2025",
    start: "2025-01-01",
    end: "2026-01-01",
    colorVar: "var(--series-6)",
    description:
      "Chain-of-thought reasoning trained via reinforcement learning becomes the new scaling axis, led by DeepSeek-R1's low-cost breakthrough and o-series/thinking models.",
  },
  {
    id: "frontier-2026",
    label: "2026 Frontier",
    range: "2026",
    start: "2026-01-01",
    end: "2027-01-01",
    colorVar: "var(--series-7)",
    description:
      "Rapid point-release cadence continues across every major lab, with agentic capability, million-token context, and multimodal generation as the new battleground.",
  },
];

export const ERA_MAP: Record<string, EraInfo> = Object.fromEntries(
  ERAS.map((e) => [e.id, e]),
);
