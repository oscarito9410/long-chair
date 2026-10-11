import { ScreenIntro } from "../components/chrome/ScreenIntro.tsx";
import { PlaceCard } from "../components/kit/PlaceCard.tsx";
import { TopicCard } from "../components/kit/TopicCard.tsx";
import { SectionHeading } from "../components/ui/SectionHeading.tsx";
import { SolidPanel } from "../components/ui/SolidPanel.tsx";
import { kindMeta } from "../content/presentation.ts";
import { companionSetting, companionTopics, nearbyPlaces } from "../data/companion.ts";
import { tasteSeeds } from "../data/taste-seeds.ts";
import type { IconName } from "../components/ui/icon-names.ts";
import type { Hue } from "../tokens/tokens.ts";
import { useSession } from "../state/SessionContext.tsx";

function topicAppearance(seedId: string): { hue: Hue; icon: IconName } {
  const seed = tasteSeeds.find((entry) => entry.id === seedId);
  if (!seed) {
    return kindMeta.movie;
  }
  return kindMeta[seed.kind];
}

export function CompanionScreen() {
  const { draft } = useSession();
  const topics = companionTopics.filter((topic) => draft.seedIds.includes(topic.seedId));

  return (
    <div className="flex flex-col gap-8" data-screen="companion">
      <ScreenIntro
        hero={String(nearbyPlaces.length)}
        caption={`open nearby ${companionSetting.when}`}
        title="For the person with you"
        lede="Topics come from the same tastes. The places are a sample of what a location search would return."
      />
      <SolidPanel>
        <p className="text-lg leading-relaxed">
          Near {companionSetting.placeName}. {companionSetting.disclaimer}
        </p>
      </SolidPanel>
      <section className="flex flex-col gap-6">
        <SectionHeading>Open nearby</SectionHeading>
        <div className="flex flex-col gap-6">
          {nearbyPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-6">
        <SectionHeading>Things to talk about</SectionHeading>
        {topics.length === 0 ? (
          <p className="text-lg leading-relaxed" role="status">
            Add a taste and the conversation starters return.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {topics.map((topic) => {
              const appearance = topicAppearance(topic.seedId);
              return (
                <TopicCard
                  key={topic.id}
                  title={topic.title}
                  prompt={topic.prompt}
                  hue={appearance.hue}
                  icon={appearance.icon}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
