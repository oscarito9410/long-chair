import { Character } from "../components/art/Character.tsx";
import { PlaceCard } from "../components/kit/PlaceCard.tsx";
import { TopicCard } from "../components/kit/TopicCard.tsx";
import { GlassSurface } from "../components/glass/GlassSurface.tsx";
import { SectionHeading } from "../components/ui/SectionHeading.tsx";
import { tasteCharacter } from "../content/presentation.ts";
import { nearbyPlaces, topicsForSeeds } from "@long-chair/core";
import { guideById } from "@long-chair/core";
import { guideHeader } from "@long-chair/core";
import { useSession } from "../state/SessionContext.tsx";

export function CompanionScreen() {
  const { draft } = useSession();
  const guide = guideById(draft.companionId);
  const topics = topicsForSeeds(draft.seedIds);

  return (
    <div className="flex flex-col gap-8" data-screen="companion">
      <header className="flex items-center gap-4">
        <Character variant={guide.variant} size="md" animate />
        <GlassSurface variant="chip" thickness="regular" className="min-w-0 px-4 py-2">
          <h1 className="text-2xl font-extrabold leading-tight">
            {guideHeader(guide.personality, guide.quote)}
          </h1>
        </GlassSurface>
      </header>
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
          <p className="text-lg" role="status">
            Add a taste to see prompts.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                prompt={topic.title}
                character={tasteCharacter(topic.seedId)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
