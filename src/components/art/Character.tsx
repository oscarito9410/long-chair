import type { CharacterVariant } from "../../data/character-kinds.ts";
import { cn } from "../../lib/cn.ts";
import { hueVar } from "../../tokens/tokens.ts";

type CharacterSize = "sm" | "md" | "lg";

const bodies: Record<CharacterVariant["shape"], string> = {
  pebble: "M60 28c22 0 38 16 38 36S82 104 60 104 22 86 22 64 38 28 60 28z",
  bean: "M38 40c18-16 46-8 50 16 6 28-8 48-30 50-24 2-40-16-38-38 2-16 8-22 18-28z",
  drop: "M60 16c28 22 34 36 34 54a34 34 0 1 1-68 0c0-18 6-32 34-54z",
  bun: "M60 34a28 28 0 0 1 0 56 28 28 0 0 1 0-56zm22-16a14 14 0 1 1 0 28 14 14 0 0 1 0-28z",
  arch: "M28 96V58C28 36 42 24 60 24s32 12 32 34v38H28z",
  sprout:
    "M60 46a26 26 0 1 1 0 52 26 26 0 0 1 0-52zM78 28c14 2 22 14 18 24-8-2-16 2-22 8 2-14 0-26 4-32z",
};

const eyeY: Record<CharacterVariant["shape"], number> = {
  pebble: 62,
  bean: 64,
  drop: 70,
  bun: 66,
  arch: 58,
  sprout: 72,
};

export function Character({
  variant,
  size = "sm",
  animate = false,
}: {
  variant: CharacterVariant;
  size?: CharacterSize;
  animate?: boolean;
}) {
  const y = eyeY[variant.shape];
  const fill = `var(${hueVar[variant.hue]})`;
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("character", `character-${size}`, animate && "character-bob")}
      aria-hidden="true"
      focusable="false"
    >
      <path d={bodies[variant.shape]} fill={fill} />
      <circle cx="46" cy={y + 10} r="7" fill="var(--lc-card)" opacity="0.72" />
      <circle cx="78" cy={y + 12} r="6" fill="var(--lc-card)" opacity="0.72" />
      <g className={animate ? "character-eyes" : undefined}>
        <circle cx="48" cy={y} r="4.5" fill="var(--lc-ink)" />
        <circle cx="74" cy={y} r="4.5" fill="var(--lc-ink)" />
      </g>
      <path
        d={`M48 ${y + 16} Q61 ${y + 28} 74 ${y + 16}`}
        fill="none"
        stroke="var(--lc-ink)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
