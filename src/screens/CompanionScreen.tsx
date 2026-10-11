import { Character } from "../components/art/Character.tsx";
import { ScreenIntro } from "../components/chrome/ScreenIntro.tsx";
import { PlaceCard } from "../components/kit/PlaceCard.tsx";
import { TopicCard } from "../components/kit/TopicCard.tsx";
import { GlassSurface } from "../components/glass/GlassSurface.tsx";
import { SectionHeading } from "../components/ui/SectionHeading.tsx";
import { tasteCharacter } from "../content/presentation.ts";
import { companionSetting, companionTopics, nearbyPlaces } from "../data/companion.ts";
import { guideById } from "../data/guides.ts";
import { useSession } from "../state/SessionContext.tsx";

export function CompanionScreen() {
  const { draft } = useSession();
  const guide = guideById(draft.companionId);
  const topics = companionTopics.filter((topic) => draft.seedIds.includes(topic.seedId));

  return (
    <div className="flex flex-col gap-8" data-screen="companion">
      <ScreenIntro
        hero={String(nearbyPlaces.length)}
        caption={`open nearby ${companionSetting.when}`}
        title="For the person with you"
        lede={`${guide.name} is keeping you company. Topics come from the same tastes.`}
      />
      <div className="flex flex-col items-center gap-4 text-center">
        <Character variant={guide.variant} size="lg" animate />
        <GlassSurface variant="chip" thickness="thin" className="px-4 py-2">
          <span className="text-base font-bold">{guide.personality}</span>
        </GlassSurface>
        <p className="text-lg leading-relaxed">{guide.quote}</p>
        <p className="text-lg leading-relaxed">
          Near {companionSetting.placeName}. {companionSetting.disclaimer}
        </p>
      </div>
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
              <TopicCard
                key={topic.id}
                title={topic.title}
                prompt={topic.prompt}
                character={tasteCharacter(topic.seedId)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
