import { hueVar, motion, type DotMode, type Hue } from "../../tokens/tokens.ts";

export type Dot = {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  scale: number;
  alpha: number;
  phase: number;
  hueIndex: number;
};

const hueOrder: readonly Hue[] = ["apricot", "seaglass", "honey", "wisteria"];
const hueVars = hueOrder.map((hue) => hueVar[hue]);

const jitterXStep = 17;
const jitterYStep = 13;
const jitterSpread = 9;
const jitterCenter = 4;
const phaseSlots = 16;
const phaseStep = 0.4;

export function readHueColors(): string[] {
  const style = getComputedStyle(document.documentElement);
  return hueVars.map((name) => style.getPropertyValue(name).trim());
}

export function createDots(width: number, height: number): Dot[] {
  if (width <= 0 || height <= 0) {
    return [];
  }
  const gap = motion.dotSpacing;
  const cols = Math.ceil(width / gap);
  const rows = Math.ceil(height / gap);
  const dots: Dot[] = [];
  let index = 0;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const jitterX = ((index * jitterXStep) % jitterSpread) - jitterCenter;
      const jitterY = ((index * jitterYStep) % jitterSpread) - jitterCenter;
      const x = col * gap + gap / 2 + jitterX;
      const y = row * gap + gap / 2 + jitterY;
      dots.push({
        homeX: x,
        homeY: y,
        x,
        y,
        scale: 1,
        alpha: motion.dotAlphaRest,
        phase: (index % phaseSlots) * phaseStep,
        hueIndex: index % hueOrder.length,
      });
      index += 1;
    }
  }
  return dots;
}

type StepInput = {
  dots: Dot[];
  width: number;
  height: number;
  pointerX: number;
  pointerY: number;
  pointerActive: boolean;
  mode: DotMode;
  reduced: boolean;
  time: number;
};

export function stepDots(input: StepInput): void {
  const focalX = input.width / 2;
  const focalY = input.height * motion.gatherFocal;
  for (const dot of input.dots) {
    let targetX = dot.homeX;
    let targetY = dot.homeY;
    let targetScale = 1;
    let targetAlpha: number = motion.dotAlphaRest;

    if (!input.reduced && input.pointerActive) {
      const dx = input.pointerX - dot.homeX;
      const dy = input.pointerY - dot.homeY;
      const distance = Math.hypot(dx, dy);
      const influence = Math.max(0, 1 - distance / motion.dotInfluence);
      if (influence > 0 && distance > 0) {
        targetX += (dx / distance) * influence * motion.dotDisplace;
        targetY += (dy / distance) * influence * motion.dotDisplace;
        targetScale += influence * motion.dotScaleBoost;
        targetAlpha += influence * motion.dotAlphaBoost;
      }
    }

    if (!input.reduced && input.mode === "gather") {
      targetX += (focalX - dot.homeX) * motion.gatherPull;
      targetY += (focalY - dot.homeY) * motion.gatherPull;
      const pulse = 0.5 + 0.5 * Math.sin(input.time * motion.gatherPulseSpeed + dot.phase);
      targetScale = Math.max(targetScale, 1 + pulse * motion.gatherScale);
      targetAlpha = Math.max(targetAlpha, motion.dotAlphaRest + pulse * motion.gatherAlpha);
    }

    if (input.reduced) {
      dot.x = targetX;
      dot.y = targetY;
      dot.scale = targetScale;
      dot.alpha = targetAlpha;
      continue;
    }

    dot.x += (targetX - dot.x) * motion.dotEase;
    dot.y += (targetY - dot.y) * motion.dotEase;
    dot.scale += (targetScale - dot.scale) * motion.dotEase;
    dot.alpha += (targetAlpha - dot.alpha) * motion.dotEase;
  }
}

export function dotsSettled(dots: readonly Dot[], mode: DotMode, pointerActive: boolean): boolean {
  if (mode === "gather" || pointerActive) {
    return false;
  }
  return dots.every(
    (dot) =>
      Math.abs(dot.x - dot.homeX) < motion.settleEpsilon &&
      Math.abs(dot.y - dot.homeY) < motion.settleEpsilon &&
      Math.abs(dot.scale - 1) < motion.settleEpsilon &&
      Math.abs(dot.alpha - motion.dotAlphaRest) < motion.settleEpsilon,
  );
}

function hexWithAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) {
    return hex;
  }
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  if (Number.isNaN(red) || Number.isNaN(green) || Number.isNaN(blue)) {
    return hex;
  }
  const clamped = Math.min(1, Math.max(0, alpha));
  return `rgba(${red}, ${green}, ${blue}, ${clamped})`;
}

export function drawDots(
  context: CanvasRenderingContext2D,
  dots: readonly Dot[],
  colors: readonly string[],
  width: number,
  height: number,
): void {
  context.clearRect(0, 0, width, height);
  for (const dot of dots) {
    const color = colors[dot.hueIndex];
    if (!color) {
      continue;
    }
    context.beginPath();
    context.fillStyle = hexWithAlpha(color, dot.alpha);
    context.arc(dot.x, dot.y, motion.dotRadius * dot.scale, 0, Math.PI * 2);
    context.fill();
  }
}
