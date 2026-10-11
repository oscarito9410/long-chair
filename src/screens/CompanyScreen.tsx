import { useState } from "react";
import { Character } from "../components/art/Character.tsx";
import { QuestionFrame } from "../components/chrome/QuestionFrame.tsx";
import { glassClass } from "../components/glass/glass-styles.ts";
import { Icon } from "../components/ui/Icon.tsx";
import { guideById, guides } from "../data/guides.ts";
import { cn } from "../lib/cn.ts";
import { paths } from "../routing/paths.ts";
import { useSession } from "../state/SessionContext.tsx";

export function CompanyScreen() {
  const { draft, setCompanion } = useSession();
  const [companionId, setCompanionId] = useState(draft.companionId);
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
    >
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
                setCompanionId(choice.id);
              }}
            >
              <span className="guide-mark">{selected ? <Icon name="check" /> : null}</span>
              <Character variant={choice.variant} size="md" animate={selected} />
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
