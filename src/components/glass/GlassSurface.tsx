import type { ReactNode } from "react";
import { cn } from "../../lib/cn.ts";

const variantClass = {
  badge: "glass-accent-badge",
  chip: "glass-accent-chip",
  bar: "glass-accent-bar",
  sheet: "glass-accent-sheet",
} as const;

export type GlassVariant = keyof typeof variantClass;

export function GlassSurface({
  children,
  className,
  variant = "badge",
}: {
  children: ReactNode;
  className?: string;
  variant?: GlassVariant;
}) {
  return <div className={cn("glass-accent", variantClass[variant], className)}>{children}</div>;
}
