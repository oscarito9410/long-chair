import type { ReactNode } from "react";
import { cn } from "../../lib/cn.ts";

export function SolidPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("solid-panel rounded-panel p-6", className)}>{children}</div>;
}
