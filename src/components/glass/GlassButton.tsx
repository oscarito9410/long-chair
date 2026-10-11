import type { ReactNode } from "react";
import { controlClass } from "./glass-styles.ts";
import { Specular } from "./Specular.tsx";

type GlassButtonProps = {
  children: ReactNode;
  tone?: "solid" | "quiet";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

export function GlassButton({
  children,
  tone = "solid",
  type = "button",
  disabled = false,
  className,
  onClick,
}: GlassButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={controlClass(tone, className)}
    >
      <Specular />
      <span className="relative">{children}</span>
    </button>
  );
}
