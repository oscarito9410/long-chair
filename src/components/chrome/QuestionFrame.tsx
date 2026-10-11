import type { ReactNode } from "react";
import { GlassButton } from "../glass/GlassButton.tsx";
import { GlassLink } from "../glass/GlassLink.tsx";
import { SampleNote } from "../ui/SampleNote.tsx";

export function QuestionFrame({
  screen,
  title,
  lede,
  children,
  primary,
  primaryHref,
  primaryDisabled = false,
  onPrimary,
  secondary,
  secondaryHref,
}: {
  screen: string;
  title: string;
  lede: string;
  children: ReactNode;
  primary: string;
  primaryHref?: string;
  primaryDisabled?: boolean;
  onPrimary?: () => void;
  secondary: string;
  secondaryHref: string;
}) {
  return (
    <div className="question" data-screen={screen}>
      <header className="flex flex-col items-center gap-4 text-center">
        <SampleNote />
        <h1 className="text-4xl font-extrabold leading-tight">{title}</h1>
        <p className="text-lg leading-relaxed text-ink-soft">{lede}</p>
      </header>
      <div className="question-body">{children}</div>
      <div className="flex flex-col items-center gap-2">
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
        <GlassLink href={secondaryHref} tone="quiet" className="w-full">
          {secondary}
        </GlassLink>
      </div>
    </div>
  );
}
