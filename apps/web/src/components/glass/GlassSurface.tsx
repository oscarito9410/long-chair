import type { ReactNode } from "react";
import type { Hue } from "../../tokens/tokens.ts";
import {
  glassClass,
  onGlassPointerMove,
  type GlassShape,
  type GlassThickness,
} from "./glass-styles.ts";

export type GlassVariant = GlassShape;

export function GlassSurface({
  children,
  className,
  variant = "card",
  thickness = "regular",
  tint,
  press = false,
  follow = false,
}: {
  children: ReactNode;
  className?: string;
  variant?: GlassShape;
  thickness?: GlassThickness;
  tint?: Hue;
  press?: boolean;
  follow?: boolean;
}) {
  return (
    <div
      className={glassClass({ thickness, shape: variant, tint, press, follow, className })}
      onPointerMove={follow ? onGlassPointerMove : undefined}
    >
      {children}
    </div>
  );
}
