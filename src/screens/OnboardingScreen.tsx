import { ScreenIntro } from "../components/chrome/ScreenIntro.tsx";
import { GlassButton } from "../components/glass/GlassButton.tsx";
import { SelectCard } from "../components/ui/SelectCard.tsx";
import { kindMeta } from "../content/presentation.ts";
import { avoidThemes } from "../data/avoid-themes.ts";
import { durationChoices } from "../data/durations.ts";
import { tasteSeeds } from "../data/taste-seeds.ts";
import { formatHoursMinutes } from "../lib/format-duration.ts";
import { paths } from "../routing/paths.ts";
import { useSession } from "../state/SessionContext.tsx";

export function OnboardingScreen() {
  const { draft, toggleSeed, toggleAvoid, setDuration, reset } = useSession();
  const canBuild = draft.seedIds.length > 0;

  return (
    <div className="flex flex-col gap-8" data-screen="onboarding">
      <ScreenIntro
        hero={formatHoursMinutes(draft.durationMinutes)}
        caption="this chair"
        title="What should we keep close?"
        lede="Choose from the sample shelf. In the live product these names would be resolved from taste, not stored as health information."
      />
      <form
        className="flex flex-col gap-8"
        onSubmit={(event) => {
          event.preventDefault();
          if (!canBuild) {
            return;
          }
          window.location.hash = paths.building;
        }}
      >
        <fieldset className="flex flex-col gap-6">
          <legend className="text-2xl font-bold">Things you love</legend>
          <p className="text-lg leading-relaxed">
            Tap any that belong in the room. The shelf is fictional, so you can change it freely.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {tasteSeeds.map((seed) => {
              const meta = kindMeta[seed.kind];
              return (
                <SelectCard
                  key={seed.id}
                  selection="toggle"
                  checked={draft.seedIds.includes(seed.id)}
                  onChange={() => {
                    toggleSeed(seed.id);
                  }}
                  hue={meta.hue}
                  icon={meta.icon}
                  title={seed.name}
                  detail={seed.detail}
                  selectedLabel="In the room"
                />
              );
            })}
          </div>
        </fieldset>
        <fieldset className="flex flex-col gap-6">
          <legend className="text-2xl font-bold">Length of the chair</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            {durationChoices.map((choice) => (
              <SelectCard
                key={choice.minutes}
                selection="single"
                name="session-length"
                value={String(choice.minutes)}
                checked={draft.durationMinutes === choice.minutes}
                onChange={() => {
                  setDuration(choice.minutes);
                }}
                hue="seaglass"
                icon="clock"
                title={choice.label}
                detail={choice.detail}
                selectedLabel="This chair"
              />
            ))}
          </div>
        </fieldset>
        <fieldset className="flex flex-col gap-6">
          <legend className="text-2xl font-bold">Themes to leave out</legend>
          <p className="text-lg leading-relaxed">
            These stay out of the kit. You can turn one back on if you want it in the room.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {avoidThemes.map((theme) => (
              <SelectCard
                key={theme.id}
                selection="toggle"
                checked={draft.avoidIds.includes(theme.id)}
                onChange={() => {
                  toggleAvoid(theme.id);
                }}
                hue="wisteria"
                icon="aside"
                title={theme.label}
                detail={theme.detail}
                selectedLabel="Left out"
              />
            ))}
          </div>
          <p className="text-lg">Names and medical details never leave this page.</p>
        </fieldset>
        {canBuild ? null : (
          <p className="text-lg" role="status">
            Choose one title before building the kit.
          </p>
        )}
        <div className="flex flex-col gap-4">
          <GlassButton type="submit" disabled={!canBuild} className="w-full">
            Build my kit
          </GlassButton>
          <GlassButton type="button" tone="quiet" onClick={reset} className="w-full">
            Restore the sample
          </GlassButton>
        </div>
      </form>
    </div>
  );
}
