import type { ReactNode } from "react";
import { hueDeepBgClass } from "../../tokens/hue-styles.ts";
import type { Hue } from "../../tokens/tokens.ts";
import { cn } from "../../lib/cn.ts";

export function IconWell({ hue, children }: { hue: Hue; children: ReactNode }) {
  return <span className={cn("well", hueDeepBgClass[hue])}>{children}</span>;
}
