import { cn } from "../../lib/cn.ts";

export function controlClass(tone: "solid" | "quiet", className?: string): string {
  return cn(
    "relative inline-flex min-h-[var(--lc-target)] items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-lg font-bold",
    tone === "solid" ? "bg-seaglass-deep text-page" : "glass text-ink",
    className,
  );
}
