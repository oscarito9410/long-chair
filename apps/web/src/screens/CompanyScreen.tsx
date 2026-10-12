import { useState } from "react";
import { Character } from "../components/art/Character.tsx";
import { useTickle } from "../hooks/use-tickle.ts";
import { QuestionFrame } from "../components/chrome/QuestionFrame.tsx";
import { GlassButton } from "../components/glass/GlassButton.tsx";
import { glassClass } from "../components/glass/glass-styles.ts";
import { Icon } from "../components/ui/Icon.tsx";
import { ONBOARDING_DOT_COUNT, onboardingProgress } from "../content/onboarding.ts";
import { guideById, guides } from "@long-chair/core";
import { cn } from "../lib/cn.ts";
import { paths } from "../routing/paths.ts";
import { useSession } from "../state/SessionContext.tsx";

export function CompanyScreen() {
  const { draft, setCompanion } = useSession();
  const [companionId, setCompanionId] = useState(draft.companionId);
  const [picked, setPicked] = useState(false);
  const { tickling, tap, force } = useTickle();
  const guide = guideById(companionId);

  return (
    <QuestionFrame
      screen="company"
      title="Who keeps you company?"
      primary={`Choose ${guide.name}`}
      onPrimary={() => {
        setCompanion(guide.id);
        window.location.hash = paths.building;
      }}
      secondary="Skip for now"
      secondaryHref={paths.building}
      progress={{ ...onboardingProgress.company, total: ONBOARDING_DOT_COUNT }}
    >
      <GlassButton tone="quiet" onClick={force}>
        Tickle
      </GlassButton>
      <div className="guide-grid">
        {guides.map((choice) => {
          const selected = choice.id === guide.id;
          return (
            <button
              key={choice.id}
              type="button"
              className={cn(
                glassClass({ thickness: "thin", shape: "card", press: true }),
                "guide-pick",
                selected && "is-selected",
              )}
              aria-pressed={selected}
              onClick={() => {
                setPicked(true);
                setCompanionId(choice.id);
                tap();
              }}
            >
              <span className="guide-mark">{selected ? <Icon name="check" /> : null}</span>
              <Character
                variant={choice.variant}
                size="md"
                animate
                settle={selected}
                expression={selected ? (picked ? "celebration" : "attention") : undefined}
                tickled={tickling && selected}
              />
              <span className="text-lg font-bold">{choice.name}</span>
            </button>
          );
        })}
      </div>
      <p className="text-center text-lg leading-relaxed" aria-live="polite">
        {guide.quote}
      </p>
    </QuestionFrame>
  );
}
