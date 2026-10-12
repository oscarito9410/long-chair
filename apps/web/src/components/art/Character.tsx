import {
  characterBody,
  characterEyes,
  characterEyeY,
  characterTone,
  eyeArcPath,
  eyeHighlight,
  type CharacterVariant,
  type EyeMark,
} from "@long-chair/core";
import { useId } from "react";
import { cn } from "../../lib/cn.ts";
import { palette } from "../../tokens/tokens.ts";

type CharacterSize = "sm" | "md" | "lg";

export function Character({
  variant,
  size = "sm",
  animate = false,
  settle = false,
}: {
  variant: CharacterVariant;
  size?: CharacterSize;
  animate?: boolean;
  settle?: boolean;
}) {
  const eyeY = characterEyeY[variant.shape];
  const mood = variant.mood ?? "smile";
  const tone = characterTone[variant.hue];
  const gradientId = `lc-mark-${useId().replace(/:/g, "")}`;
  const live = animate || settle;

  return (
    <svg
      viewBox="0 0 120 120"
      className={cn(
        "character",
        `character-${size}`,
        settle ? "character-settle" : animate && "character-live",
      )}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={gradientId} cx="34%" cy="28%" r="72%" fx="30%" fy="22%">
          <stop offset="0" stopColor={tone.light} />
          <stop offset="0.55" stopColor={tone.body} />
          <stop offset="1" stopColor={tone.shade} />
        </radialGradient>
      </defs>
      <path d={characterBody[variant.shape]} fill={`url(#${gradientId})`} />
      <g className={settle ? "character-glance" : undefined}>
        <g className={live ? "character-eyes" : undefined}>
          {characterEyes(mood, eyeY).map((mark) => (
            <Eye key={`${mark.kind}-${mark.x}`} mark={mark} />
          ))}
        </g>
      </g>
    </svg>
  );
}

function Eye({ mark }: { mark: EyeMark }) {
  if (mark.kind === "arc") {
    return <path d={eyeArcPath(mark)} fill={palette.ink} />;
  }
  const showShine = mark.height >= eyeHighlight.minEye;
  return (
    <g>
      <rect
        x={mark.x}
        y={mark.y}
        width={mark.width}
        height={mark.height}
        rx={mark.width / 2}
        fill={palette.ink}
      />
      {showShine ? (
        <rect
          x={mark.x + eyeHighlight.insetX}
          y={mark.y + eyeHighlight.insetY}
          width={eyeHighlight.width}
          height={eyeHighlight.height}
          rx={eyeHighlight.radius}
          fill={palette.white}
        />
      ) : null}
    </g>
  );
}
