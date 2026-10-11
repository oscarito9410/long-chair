import type { ReactNode } from "react";
import { controlClass } from "./glass-styles.ts";

type GlassLinkProps = {
  href: string;
  children: ReactNode;
  tone?: "solid" | "quiet";
  className?: string;
};

export function GlassLink({ href, children, tone = "solid", className }: GlassLinkProps) {
  return (
    <a href={href} className={controlClass(tone, className)}>
      {children}
    </a>
  );
}
