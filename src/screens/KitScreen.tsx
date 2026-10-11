import { ScreenIntro } from "../components/chrome/ScreenIntro.tsx";
import { GlassLink } from "../components/glass/GlassLink.tsx";
import { PauseCard } from "../components/kit/PauseCard.tsx";
import { TimelineCard } from "../components/kit/TimelineCard.tsx";
import { EmptyState } from "../components/ui/EmptyState.tsx";
import { ThemeBadge } from "../components/ui/ThemeBadge.tsx";
import { kindMeta } from "../content/presentation.ts";
import { avoidThemes } from "../data/avoid-themes.ts";
import { itemById } from "../data/catalog.ts";
import { formatHoursMinutes, formatRange } from "../lib/format-duration.ts";
import { matchingSeedNames } from "../lib/match-taste.ts";
import { PAUSE_NOTICE_MINUTES } from "../lib/pack-session.ts";
import { paths } from "../routing/paths.ts";
import { usePackedSession } from "../hooks/use-packed-session.ts";
import { useSession } from "../state/SessionContext.tsx";

export function KitScreen() {
  const { draft } = useSession();
  const packed = usePackedSession();
  const themes = avoidThemes.filter((theme) => draft.avoidIds.includes(theme.id));

  return (
    <div className="flex flex-col gap-8" data-screen="kit">
      <ScreenIntro
        hero={formatHoursMinutes(packed.filledMinutes)}
        caption="filled"
        title="Your session kit"
      >
        {themes.length > 0 ? (
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Left out">
            {themes.map((theme) => (
              <li key={theme.id}>
                <ThemeBadge label={theme.label} />
              </li>
            ))}
          </ul>
        ) : null}
      </ScreenIntro>
      {packed.slots.length === 0 ? (
        <EmptyState
          title="Nothing fit this chair yet"
          href={paths.onboarding}
          action="Edit the session"
        />
      ) : (
        <ol className="timeline">
          {packed.slots.map((slot) => {
            const item = itemById(slot.itemId);
            if (!item) {
              return null;
            }
            const meta = kindMeta[item.kind];
            return (
              <li key={item.id}>
                <TimelineCard
                  href={paths.item(item.id)}
                  seed={item.id}
                  rangeLabel={formatRange(slot.startMinute, slot.endMinute)}
                  kindLabel={meta.label}
                  kind={item.kind}
                  title={item.title}
                  hue={meta.hue}
                  icon={meta.icon}
                  because={matchingSeedNames(item, draft)[0]}
                />
              </li>
            );
          })}
        </ol>
      )}
      {packed.openMinutes >= PAUSE_NOTICE_MINUTES ? (
        <PauseCard minutes={packed.openMinutes} />
      ) : null}
      <GlassLink href={paths.onboarding} tone="quiet" className="w-full">
        Edit tastes
      </GlassLink>
    </div>
  );
}
