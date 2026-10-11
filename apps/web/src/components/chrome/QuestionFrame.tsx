import type { ReactNode } from "react";
import { cn } from "../../lib/cn.ts";
import { GlassButton } from "../glass/GlassButton.tsx";
import { GlassLink } from "../glass/GlassLink.tsx";
import { QuestionProgress } from "./QuestionProgress.tsx";

export function QuestionFrame({
  screen,
  title,
  lede,
  note,
  children,
  primary,
  primaryHref,
  primaryDisabled = false,
  onPrimary,
  secondary,
  secondaryHref,
  progress,
  dock = false,
}: {
  screen: string;
  title: string;
  lede?: string;
  note?: string;
  children: ReactNode;
  primary: string;
  primaryHref?: string;
  primaryDisabled?: boolean;
  onPrimary?: () => void;
  secondary?: string;
  secondaryHref?: string;
  progress?: { step: number; total: number; backHref: string };
  dock?: boolean;
}) {
  return (
    <div className={cn("question", dock && "question-tight")} data-screen={screen}>
      {progress ? (
        <QuestionProgress
          step={progress.step}
          total={progress.total}
          backHref={progress.backHref}
        />
      ) : null}
      <header className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-extrabold leading-tight">{title}</h1>
        {lede ? <p className="text-lg leading-relaxed">{lede}</p> : null}
        {note ? <p className="text-base leading-relaxed">{note}</p> : null}
      </header>
      <div className={cn("question-body", dock && "question-body-tight")}>{children}</div>
      <div className={cn("flex flex-col items-center gap-2", dock && "question-dock")}>
        {primaryHref && !primaryDisabled ? (
          <GlassLink href={primaryHref} className="w-full">
            {primary}
          </GlassLink>
        ) : (
          <GlassButton
            type="button"
            className="w-full"
            disabled={primaryDisabled}
            onClick={onPrimary}
          >
            {primary}
          </GlassButton>
        )}
        {secondary && secondaryHref ? (
          <GlassLink href={secondaryHref} tone="quiet" className="w-full">
            {secondary}
          </GlassLink>
        ) : null}
      </div>
    </div>
  );
}
