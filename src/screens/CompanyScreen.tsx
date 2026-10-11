import { useState } from "react";
import { Character } from "../components/art/Character.tsx";
import { QuestionFrame } from "../components/chrome/QuestionFrame.tsx";
import { GlassSurface } from "../components/glass/GlassSurface.tsx";
import { glassClass } from "../components/glass/glass-styles.ts";
import { Icon } from "../components/ui/Icon.tsx";
import { guideById, guides } from "../data/guides.ts";
import { paths } from "../routing/paths.ts";
import { useSession } from "../state/SessionContext.tsx";

export function CompanyScreen() {
  const { draft, setCompanion } = useSession();
  const initial = Math.max(
    0,
    guides.findIndex((guide) => guide.id === draft.companionId),
  );
  const [index, setIndex] = useState(initial);
  const guide = guides[index] ?? guideById(draft.companionId);

  const shift = (direction: number) => {
    setIndex((current) => (current + direction + guides.length) % guides.length);
  };

  return (
    <QuestionFrame
      screen="company"
      title="Who keeps you company?"
      lede="Pick a guide for the person sitting with you. They only change the tone, not the kit."
      primary="They'll sit with me"
      onPrimary={() => {
        setCompanion(guide.id);
        window.location.hash = paths.building;
      }}
      secondary="Skip for now"
      secondaryHref={paths.building}
    >
      <div className="guide-layout flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className={glassClass({
              thickness: "thin",
              shape: "pill",
              press: true,
              className: "icon-hit",
            })}
            aria-label="Previous guide"
            onClick={() => {
              shift(-1);
            }}
          >
            <Icon name="arrow" />
          </button>
          <div className="guide-stack">
            <Character variant={guide.variant} size="lg" animate />
            <GlassSurface
              variant="card"
              thickness="regular"
              className="guide-card flex flex-col items-center gap-2 px-6 pb-6"
            >
              <p className="text-base" aria-live="polite">
                {index + 1} of {guides.length}
              </p>
              <h2 className="text-2xl font-bold">{guide.name}</h2>
              <GlassSurface
                variant="chip"
                thickness="thin"
                tint={guide.variant.hue}
                className="px-4 py-2"
              >
                <span className="text-base font-bold">{guide.personality}</span>
              </GlassSurface>
              <p className="text-lg leading-relaxed">{guide.quote}</p>
            </GlassSurface>
          </div>
          <button
            type="button"
            className={glassClass({
              thickness: "thin",
              shape: "pill",
              press: true,
              className: "icon-hit",
            })}
            aria-label="Next guide"
            onClick={() => {
              shift(1);
            }}
          >
            <span className="inline-block rotate-180">
              <Icon name="arrow" />
            </span>
          </button>
        </div>
      </div>
    </QuestionFrame>
  );
}
