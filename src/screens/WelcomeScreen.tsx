import { ScreenIntro } from "../components/chrome/ScreenIntro.tsx";
import { GlassLink } from "../components/glass/GlassLink.tsx";
import { GlassPanel } from "../components/glass/GlassPanel.tsx";
import { PointCard } from "../components/ui/PointCard.tsx";
import { welcomePoints } from "../content/welcome-points.ts";
import { TYPICAL_CHAIR_MINUTES } from "../data/durations.ts";
import { formatHoursMinutes } from "../lib/format-duration.ts";
import { paths } from "../routing/paths.ts";

export function WelcomeScreen() {
  return (
    <div className="flex flex-col gap-8" data-screen="welcome">
      <ScreenIntro
        hero={formatHoursMinutes(TYPICAL_CHAIR_MINUTES)}
        caption="a common chair, filled on purpose"
        title="Long Chair"
        aside="sized to the hours already in front of you"
        mark={{ hue: "apricot", icon: "chair" }}
      >
        <p className="text-2xl font-bold leading-snug">What you love, minus what hurts.</p>
        <p className="text-lg leading-relaxed">
          A session kit made from a few things you already love, with the themes you want left out,
          cut to the length of the chair.
        </p>
      </ScreenIntro>
      <div className="flex flex-col gap-6">
        {welcomePoints.map((point) => (
          <PointCard
            key={point.id}
            hue={point.hue}
            icon={point.icon}
            title={point.title}
            body={point.body}
          />
        ))}
      </div>
      <GlassPanel>
        <p className="text-lg leading-relaxed">
          Long Chair is for comfort and company. It is not medical advice, and it does not ask for a
          diagnosis, a chart, or a name. This prototype keeps every choice in the browser and sends
          nothing.
        </p>
      </GlassPanel>
      <div className="flex flex-col gap-4 sm:flex-row">
        <GlassLink href={paths.onboarding} className="w-full sm:flex-1">
          Plan a session
        </GlassLink>
        <GlassLink href={paths.kit} tone="quiet" className="w-full sm:flex-1">
          See the sample kit
        </GlassLink>
      </div>
      <GlassLink href={paths.compare} tone="quiet" className="w-full">
        See what a plain model gets wrong
      </GlassLink>
    </div>
  );
}
