import type { PointerEvent } from "react";
import type { Hue } from "../../tokens/tokens.ts";
import { cn } from "../../lib/cn.ts";

export type GlassThickness = "thin" | "regular" | "thick";
export type GlassShape =
  "badge" | "chip" | "bar" | "sheet" | "card" | "pill" | "row" | "disc" | "sticker";

const thicknessClass: Record<GlassThickness, string> = {
  thin: "glass-thin",
  regular: "glass-regular",
  thick: "glass-thick",
};

const shapeClass: Record<GlassShape, string> = {
  badge: "glass-badge",
  chip: "glass-chip",
  bar: "glass-bar",
  sheet: "glass-sheet",
  card: "glass-card",
  pill: "glass-pill",
  row: "glass-row",
  disc: "glass-disc",
  sticker: "glass-sticker",
};

export function glassClass({
  thickness = "regular",
  shape = "card",
  tint,
  press = false,
  className,
}: {
  thickness?: GlassThickness;
  shape?: GlassShape;
  tint?: Hue;
  press?: boolean;
  className?: string;
} = {}): string {
  return cn(
    "glass-surface",
    thicknessClass[thickness],
    shapeClass[shape],
    tint && `glass-tint-${tint}`,
    press && "glass-press",
    className,
  );
}

export function onGlassPointerMove(event: PointerEvent<HTMLElement>): void {
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--sheen-x", `${event.clientX - box.left}px`);
  event.currentTarget.style.setProperty("--sheen-y", `${event.clientY - box.top}px`);
}

export function controlClass(tone: "solid" | "quiet", className?: string): string {
  return cn(
    "inline-flex min-h-[var(--lc-target)] items-center justify-center gap-2 rounded-full px-6 text-lg font-bold",
    tone === "solid"
      ? "glass-surface glass-regular glass-pill glass-ink glass-press"
      : "action-quiet",
    className,
  );
}
