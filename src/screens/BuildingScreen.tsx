import { useEffect, useMemo, useState } from "react";
import { Character } from "../components/art/Character.tsx";
import { ScreenIntro } from "../components/chrome/ScreenIntro.tsx";
import { GlassLink } from "../components/glass/GlassLink.tsx";
import { StepRow, type StepState } from "../components/kit/StepRow.tsx";
import { guideById } from "../data/guides.ts";
import { buildAgentSteps } from "../lib/build-agent-steps.ts";
import { formatHoursMinutes } from "../lib/format-duration.ts";
import { paths } from "../routing/paths.ts";
import { useSession } from "../state/SessionContext.tsx";
import { useReducedMotion } from "../hooks/use-reduced-motion.ts";
import { motion } from "../tokens/tokens.ts";

function stepState(index: number, shown: number, total: number): StepState {
  if (index < shown) {
    return "done";
  }
  if (shown < total && index === shown) {
    return "active";
  }
  return "pending";
}

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
  const activeStep = steps[shown];
  const liveText = complete ? "The kit is ready." : (activeStep?.title ?? "Starting");

  return (
    <div
      className="flex flex-col gap-8"
      data-screen="building"
      data-state={complete ? "ready" : "working"}
    >
      <ScreenIntro
        hero={formatHoursMinutes(draft.durationMinutes)}
        caption="the chair we are filling"
        title="Building your kit"
        lede="A preview of the agent. These steps are illustrated with the sample shelf. No live catalog is called."
      />
      <p className="sr-only" aria-live="polite">
        {liveText}
      </p>
      <div className="flex justify-center">
        <Character variant={guideById(draft.companionId).variant} size="md" animate />
      </div>
      <ol className="m-0 flex list-none flex-col gap-4 p-0">
        {steps.map((step, index) => (
          <StepRow
            key={step.id}
            index={index}
            title={step.title}
            detail={step.detail}
            state={stepState(index, shown, steps.length)}
          />
        ))}
      </ol>
      <GlassLink href={paths.ready} tone={complete ? "solid" : "quiet"} className="w-full">
        {complete ? "Your kit is ready" : "Skip for now"}
      </GlassLink>
    </div>
  );
}
