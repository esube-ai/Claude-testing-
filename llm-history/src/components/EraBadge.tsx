import type { Era } from "../data/types";
import { ERA_MAP } from "../data/eras";

export default function EraBadge({ era, size = "sm" }: { era: Era; size?: "sm" | "md" }) {
  const info = ERA_MAP[era];
  if (!info) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-hairline font-medium whitespace-nowrap ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
      style={{ color: info.colorVar }}
    >
      <span
        className="inline-block rounded-full"
        style={{
          width: size === "sm" ? 6 : 8,
          height: size === "sm" ? 6 : 8,
          background: info.colorVar,
        }}
      />
      {info.label}
    </span>
  );
}
