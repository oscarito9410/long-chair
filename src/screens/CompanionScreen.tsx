import { ScreenIntro } from "../components/chrome/ScreenIntro.tsx";
import { GlassPanel } from "../components/glass/GlassPanel.tsx";
import { PlaceCard } from "../components/kit/PlaceCard.tsx";
import { TopicCard } from "../components/kit/TopicCard.tsx";
import { SectionHeading } from "../components/ui/SectionHeading.tsx";
import { companionSetting, companionTopics, nearbyPlaces } from "../data/companion.ts";
import { useSession } from "../state/SessionContext.tsx";

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
      <GlassPanel>
        <p className="text-lg leading-relaxed">
          Near {companionSetting.placeName}. {companionSetting.disclaimer}
        </p>
      </GlassPanel>
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
            {topics.map((topic) => (
              <TopicCard key={topic.id} title={topic.title} prompt={topic.prompt} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
