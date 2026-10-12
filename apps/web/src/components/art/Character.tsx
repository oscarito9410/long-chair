import {
  blushFill,
  characterBody,
  characterEyeY,
  characterTone,
  expressionFace,
  expressionForMood,
  expressionIntroduces,
  expressionPose,
  eyeHighlight,
  faceArcPath,
  type CharacterVariant,
  type Expression,
  type FacePiece,
} from "@long-chair/core";
import { useId, type CSSProperties } from "react";
import { cn } from "../../lib/cn.ts";
import { palette } from "../../tokens/tokens.ts";

type CharacterSize = "sm" | "md" | "lg";

export function Character({
  variant,
  size = "sm",
  animate = false,
  settle = false,
  expression,
  tickled = false,
}: {
  variant: CharacterVariant;
  size?: CharacterSize;
  animate?: boolean;
  settle?: boolean;
  expression?: Expression;
  tickled?: boolean;
}) {
  const eyeY = characterEyeY[variant.shape];
  const face = tickled ? "tickled" : (expression ?? expressionForMood(variant.mood ?? "smile"));
  const pose = expressionPose[face];
  const tone = characterTone[variant.hue];
  const gradientId = `lc-mark-${useId().replace(/:/g, "")}`;
  const intro = settle || (animate && expressionIntroduces(face));
  const poseStyle = {
    "--pose-tilt": `${pose.tilt}deg`,
    "--pose-sx": String(pose.scaleX),
    "--pose-sy": String(pose.scaleY),
    "--pose-lift": `${pose.lift}px`,
  } as CSSProperties;

  return (
    <svg
      viewBox="0 0 120 120"
      className={cn(
        "character",
        `character-${size}`,
        `character-${face}`,
        intro && "character-intro",
        tickled && "character-tickle",
      )}
      style={poseStyle}
      data-expression={face}
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
      <g className="character-pose">
        <g className={animate && !tickled ? "character-idle" : undefined}>
          <path d={characterBody[variant.shape]} fill={`url(#${gradientId})`} />
          <g className={animate && !tickled && blinks(face) ? "character-eyes" : undefined}>
            {expressionFace(face, eyeY).map((piece, index) => (
              <Face key={`${piece.role}-${index}`} piece={piece} />
            ))}
          </g>
        </g>
      </g>
    </svg>
  );
}

function blinks(expression: Expression): boolean {
  return expression !== "support" && expression !== "celebration" && expression !== "tickled";
}

function Face({ piece }: { piece: FacePiece }) {
  const fill = piece.role === "blush" ? blushFill : palette.ink;
  if (piece.kind === "arc") {
    return <path d={faceArcPath(piece)} fill={fill} />;
  }
  if (piece.kind === "oval") {
    return (
      <ellipse
        cx={piece.x + piece.width / 2}
        cy={piece.y + piece.height / 2}
        rx={piece.width / 2}
        ry={piece.height / 2}
        fill={fill}
      />
    );
  }
  const shine = piece.role === "eye" && piece.height >= eyeHighlight.minEye;
  return (
    <g>
      <rect
        x={piece.x}
        y={piece.y}
        width={piece.width}
        height={piece.height}
        rx={piece.width / 2}
        fill={fill}
      />
      {shine ? (
        <rect
          x={piece.x + eyeHighlight.insetX}
          y={piece.y + eyeHighlight.insetY}
          width={eyeHighlight.width}
          height={eyeHighlight.height}
          rx={eyeHighlight.radius}
          fill={palette.white}
        />
      ) : null}
    </g>
  );
}
