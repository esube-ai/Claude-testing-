import { useMemo } from "react";
import { MODELS_BY_DATE, parseContextTokens, parseParamsB, formatTokens, formatParamsB } from "../data/derive";
import GrowthChart from "../components/GrowthChart";

const CONTEXT_TICKS = [512, 2_000, 8_000, 32_000, 128_000, 1_000_000, 10_000_000];
const PARAM_TICKS = [0.1, 1, 10, 100, 1_000, 10_000];

export default function GrowthPage() {
  const contextPoints = useMemo(
    () =>
      MODELS_BY_DATE.map((model) => {
        const value = parseContextTokens(model);
        return value ? { model, value } : null;
      }).filter((p): p is { model: (typeof MODELS_BY_DATE)[number]; value: number } => p !== null),
    [],
  );

  const paramPoints = useMemo(
    () =>
      MODELS_BY_DATE.map((model) => {
        const value = parseParamsB(model);
        return value ? { model, value } : null;
      }).filter((p): p is { model: (typeof MODELS_BY_DATE)[number]; value: number } => p !== null),
    [],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Growth over time
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-secondary sm:text-base">
        Two of the clearest ways to see how fast the field has moved: how much
        text a model can read at once, and how large the models themselves have
        grown. Both axes are logarithmic — each gridline is a 4–10x jump, not a
        fixed step.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">Context window growth</h2>
        <p className="mt-1 text-sm text-ink-secondary">
          Maximum input length, in tokens, on a log scale. Hover or tap any point for details.
        </p>
        <div className="mt-4">
          <GrowthChart
            points={contextPoints}
            yTicks={CONTEXT_TICKS}
            formatY={(n) => `${formatTokens(n)} tok`}
            colorVar="var(--series-1)"
            valueLabel="Context window"
          />
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-semibold text-ink">Parameter count growth</h2>
        <p className="mt-1 text-sm text-ink-secondary">
          Largest disclosed parameter figure per model (total parameters for
          mixture-of-experts models), in billions, on a log scale. Many closed
          frontier models don't disclose parameter counts and are omitted here.
        </p>
        <div className="mt-4">
          <GrowthChart
            points={paramPoints}
            yTicks={PARAM_TICKS}
            formatY={(n) => formatParamsB(n)}
            colorVar="var(--series-2)"
            valueLabel="Parameters"
          />
        </div>
      </section>

      <section className="mt-14 rounded-xl border border-hairline bg-card p-5 text-sm text-ink-secondary">
        <p>
          <strong className="text-ink">A note on the data:</strong> parameter
          counts and context windows are self-reported by each lab and not always
          directly comparable — mixture-of-experts models activate only a
          fraction of their total parameters per token, and effective usable
          context is sometimes smaller than the advertised maximum. Treat these
          charts as a directional picture of scale, not a precise leaderboard.
        </p>
      </section>
    </div>
  );
}
