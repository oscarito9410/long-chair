import type { ReactNode } from "react";
import { cn } from "../../lib/cn.ts";
import { Specular } from "./Specular.tsx";

export function GlassPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("glass relative overflow-hidden rounded-panel p-6", className)}>
      <Specular />
      <div className="relative">{children}</div>
    </div>
  );
}
