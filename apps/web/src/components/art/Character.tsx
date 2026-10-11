import type { CharacterMood, CharacterVariant } from "@long-chair/core";
import { cn } from "../../lib/cn.ts";
import { hueVar, type Hue } from "../../tokens/tokens.ts";

type CharacterSize = "sm" | "md" | "lg";

const bodies: Record<CharacterVariant["shape"], string> = {
  pebble: "M60 22c24-2 40 14 42 36 2 24-12 46-34 50-26 4-46-12-48-36C18 46 34 24 60 22z",
  bean: "M34 46c8-22 36-28 52-12 14 14 16 36 4 50-14 16-40 18-54 6-16-14-14-28-2-44z",
  drop: "M60 12c26 20 36 36 36 56a36 36 0 1 1-72 0c0-20 10-36 36-56z",
  bun: "M58 36a26 26 0 1 1 0 52 26 26 0 0 1 0-52zm28-18a12 12 0 1 1 0 24 12 12 0 0 1 0-24z",
  arch: "M24 98V62c0-24 16-40 36-40s36 16 36 40v36H24z",
  sprout:
    "M60 48a24 24 0 1 1 0 48 24 24 0 0 1 0-48zM84 30c16 2 22 16 16 26-10-4-18 2-24 10 4-16 0-30 8-36z",
};

const eyeY: Record<CharacterVariant["shape"], number> = {
  pebble: 58,
  bean: 62,
  drop: 68,
  bun: 64,
  arch: 62,
  sprout: 74,
};

const bellyHue: Record<Hue, Hue> = {
  apricot: "honey",
  seaglass: "apricot",
  honey: "apricot",
  wisteria: "seaglass",
};

function paint(hue: Hue): string {
  return `var(${hueVar[hue]})`;
}

function Eyes({ mood, y, animate }: { mood: CharacterMood; y: number; animate: boolean }) {
  const blink = animate ? "character-eyes" : undefined;
  if (mood === "content") {
    return (
      <g className={blink}>
        <path
          d={`M40 ${y + 2} q8 -9 16 0`}
          fill="none"
          stroke="var(--lc-ink)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d={`M66 ${y + 2} q8 -9 16 0`}
          fill="none"
          stroke="var(--lc-ink)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    );
  }
  if (mood === "wink") {
    return (
      <g className={blink}>
        <path
          d={`M40 ${y} q8 7 16 0`}
          fill="none"
          stroke="var(--lc-ink)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="76" cy={y} r="4.6" fill="var(--lc-ink)" />
      </g>
    );
  }
  if (mood === "curious") {
    return (
      <g className={blink}>
        <circle cx="48" cy={y} r="6" fill="var(--lc-card)" />
        <circle cx="76" cy={y - 1} r="6" fill="var(--lc-card)" />
        <circle cx="49" cy={y - 2.5} r="2.4" fill="var(--lc-ink)" />
        <circle cx="78" cy={y - 3.5} r="2.4" fill="var(--lc-ink)" />
      </g>
    );
  }
  return (
    <g className={blink}>
      <circle cx="48" cy={y} r="4.6" fill="var(--lc-ink)" />
      <circle cx="76" cy={y} r="4.6" fill="var(--lc-ink)" />
    </g>
  );
}

function Mouth({ mood, y }: { mood: CharacterMood; y: number }) {
  if (mood === "grin") {
    return <path d={`M44 ${y + 14} Q62 ${y + 32} 80 ${y + 14}`} fill="var(--lc-ink)" />;
  }
  if (mood === "curious") {
    return <ellipse cx="62" cy={y + 16} rx="5" ry="6" fill="var(--lc-ink)" />;
  }
  if (mood === "content") {
    return (
      <path
        d={`M50 ${y + 14} Q62 ${y + 22} 74 ${y + 14}`}
        fill="none"
        stroke="var(--lc-ink)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    );
  }
  return (
    <path
      d={`M46 ${y + 14} Q62 ${y + 28} 78 ${y + 14}`}
      fill="none"
      stroke="var(--lc-ink)"
      strokeWidth="3"
      strokeLinecap="round"
    />
  );
}

function Accessory({ name, hue }: { name: CharacterVariant["accessory"]; hue: Hue }) {
  const accent = paint(bellyHue[hue]);
  if (name === "bow") {
    return (
      <g>
        <path d="M78 18c8-10 20-8 22 2-8 2-14 8-16 12-2-4-8-10-6-14z" fill={accent} />
        <path d="M70 20c-10-8-20-2-18 8 6 0 12 4 14 8 2-6 6-12 4-16z" fill={accent} />
        <circle cx="78" cy="28" r="3.5" fill="var(--lc-ink)" />
      </g>
    );
  }
  if (name === "glasses") {
    return (
      <g fill="none" stroke="var(--lc-ink)" strokeWidth="2.5">
        <circle cx="48" cy="62" r="10" />
        <circle cx="76" cy="62" r="10" />
        <path d="M58 62h8" />
      </g>
    );
  }
  if (name === "leaf") {
    return <path d="M86 24c14 2 18 16 8 22-8-6-16-6-22-2 2-10 6-18 14-20z" fill={accent} />;
  }
  if (name === "scarf") {
    return <path d="M34 78c10 8 42 10 54-2 2 10-8 16-20 16H48c-10 0-16-6-14-14z" fill={accent} />;
  }
  if (name === "star") {
    return <path d="M90 28l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z" fill={accent} />;
  }
  return null;
}

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
  const mood = variant.mood ?? "smile";
  const fill = paint(variant.hue);
  const belly = paint(bellyHue[variant.hue]);
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("character", `character-${size}`, animate && "character-bob")}
      aria-hidden="true"
      focusable="false"
    >
      <path d={bodies[variant.shape]} fill={fill} />
      <ellipse cx="62" cy={y + 18} rx="16" ry="12" fill={belly} opacity="0.9" />
      <ellipse cx="46" cy={y + 16} rx="7" ry="5" fill="var(--lc-card)" opacity="0.8" />
      <ellipse cx="78" cy={y + 18} rx="6" ry="4" fill="var(--lc-card)" opacity="0.7" />
      <ellipse cx="48" cy={y - 14} rx="10" ry="6" fill="var(--lc-card)" opacity="0.35" />
      <Eyes mood={mood} y={y} animate={animate} />
      <Mouth mood={mood} y={y} />
      <Accessory name={variant.accessory ?? "none"} hue={variant.hue} />
    </svg>
  );
}
