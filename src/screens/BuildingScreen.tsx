import { useEffect, useMemo, useState } from "react";
import { Character } from "../components/art/Character.tsx";
import { QuestionProgress } from "../components/chrome/QuestionProgress.tsx";
import { ScreenIntro } from "../components/chrome/ScreenIntro.tsx";
import { GlassLink } from "../components/glass/GlassLink.tsx";
import { StepRow } from "../components/kit/StepRow.tsx";
import { ONBOARDING_DOT_COUNT, onboardingProgress } from "../content/onboarding.ts";
import { buildingReadyLabel, buildingSkipLabel } from "../content/screen-copy.ts";
import { guideById } from "../data/guides.ts";
import { buildAgentSteps } from "../lib/build-agent-steps.ts";
import { formatHoursMinutes } from "../lib/format-duration.ts";
import { buildingLiveText, stepState } from "../lib/step-state.ts";
import { paths } from "../routing/paths.ts";
import { useSession } from "../state/SessionContext.tsx";
import { useReducedMotion } from "../hooks/use-reduced-motion.ts";
import { motion } from "../tokens/tokens.ts";

export function BuildingScreen() {
  const { draft } = useSession();
  const reduced = useReducedMotion();
  const steps = useMemo(() => buildAgentSteps(draft), [draft]);
  const [now, setNow] = useState(() => Date.now());
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    if (reduced) {
      return;
    }
    const doneAt = startedAt + motion.stepIntervalMs * steps.length;
    const timer = window.setInterval(() => {
      const next = Date.now();
      if (next >= doneAt) {
        window.clearInterval(timer);
      }
      setNow(next);
    }, motion.stepIntervalMs);
    return () => {
      window.clearInterval(timer);
    };
  }, [reduced, startedAt, steps.length]);

  const elapsedSteps = Math.floor((now - startedAt) / motion.stepIntervalMs);
  const shown = reduced ? steps.length : Math.min(steps.length, elapsedSteps);
  const complete = shown >= steps.length;
  const liveText = buildingLiveText(
    steps.map((step) => step.title),
    shown,
  );
  const progress = onboardingProgress.building;

  return (
    <div
      className="flex flex-col gap-8"
      data-screen="building"
      data-state={complete ? "ready" : "working"}
    >
      <QuestionProgress
        step={progress.step}
        total={ONBOARDING_DOT_COUNT}
        backHref={progress.backHref}
      />
      <ScreenIntro
        hero={formatHoursMinutes(draft.durationMinutes)}
        caption="the chair we are filling"
        title="Building your kit"
      />
      <p className="sr-only" aria-live="polite">
        {liveText}
      </p>
      <div className="flex justify-center">
        <Character variant={guideById(draft.companionId).variant} size="md" animate />
      </div>
      <ol className="m-0 flex list-none flex-col gap-4 p-0">
        {steps.map((step, index) => (
          <StepRow key={step.id} title={step.title} state={stepState(index, shown, steps.length)} />
        ))}
      </ol>
      <GlassLink href={paths.ready} tone={complete ? "solid" : "quiet"} className="w-full">
        {complete ? buildingReadyLabel : buildingSkipLabel}
      </GlassLink>
    </div>
  );
}
