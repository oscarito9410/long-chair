import { ScreenIntro } from "../components/chrome/ScreenIntro.tsx";
import { GlassLink } from "../components/glass/GlassLink.tsx";
import { PauseCard } from "../components/kit/PauseCard.tsx";
import { TimelineCard } from "../components/kit/TimelineCard.tsx";
import { EmptyState } from "../components/ui/EmptyState.tsx";
import { kindMeta } from "../content/presentation.ts";
import { avoidThemes } from "../data/avoid-themes.ts";
import { itemById } from "../data/catalog.ts";
import { formatHoursMinutes, formatRange } from "../lib/format-duration.ts";
import { exceptionLabels, matchingSeedNames } from "../lib/match-taste.ts";
import { PAUSE_NOTICE_MINUTES, QUIET_FILL_RATIO } from "../lib/pack-session.ts";
import { paths } from "../routing/paths.ts";
import { usePackedSession } from "../hooks/use-packed-session.ts";
import { useSession } from "../state/SessionContext.tsx";

export function KitScreen() {
  const { draft } = useSession();
  const packed = usePackedSession();
  const themeLine = avoidThemes
    .filter((theme) => draft.avoidIds.includes(theme.id))
    .map((theme) => theme.label)
    .join(", ");
  const quiet = packed.filledMinutes < packed.durationMinutes * QUIET_FILL_RATIO;

  return (
    <div className="flex flex-col gap-8" data-screen="kit">
      <ScreenIntro
        hero={formatHoursMinutes(packed.filledMinutes)}
        caption={`of a ${formatHoursMinutes(packed.durationMinutes)} chair`}
        title="Your session kit"
        lede="Ordered to the length you chose. Each piece names why it is here, and that it was checked against the themes you left out."
      >
        <p className="text-lg">
          {themeLine.length > 0
            ? `Left out of the room: ${themeLine}.`
            : "No themes were set aside."}
        </p>
        <p className="text-lg">Companion and Compare sit in the bar below.</p>
      </ScreenIntro>
      {packed.slots.length === 0 ? (
        <EmptyState
          title="Nothing fit this chair yet"
          body="Add something you love, or give the session a little more time."
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
                  maker={item.maker}
                  hue={meta.hue}
                  icon={meta.icon}
                  because={matchingSeedNames(item, draft)}
                  themeCount={draft.avoidIds.length}
                  exceptions={exceptionLabels(item, draft)}
                />
              </li>
            );
          })}
        </ol>
      )}
      {quiet ? (
        <p className="text-lg leading-relaxed" role="status">
          The shelf only had a little that matched what you named. The rest of the chair stays
          quiet.
        </p>
      ) : null}
      {packed.openMinutes >= PAUSE_NOTICE_MINUTES ? (
        <PauseCard minutes={packed.openMinutes} />
      ) : null}
      <GlassLink href={paths.onboarding} tone="quiet" className="w-full">
        Edit tastes
      </GlassLink>
    </div>
  );
}
