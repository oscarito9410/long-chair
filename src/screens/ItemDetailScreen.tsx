import { ScreenIntro } from "../components/chrome/ScreenIntro.tsx";
import { GlassLink } from "../components/glass/GlassLink.tsx";
import { GlassPanel } from "../components/glass/GlassPanel.tsx";
import { SectionHeading } from "../components/ui/SectionHeading.tsx";
import { AvoidedRow } from "../components/ui/AvoidedRow.tsx";
import { BecauseList } from "../components/ui/BecauseList.tsx";
import { EmptyState } from "../components/ui/EmptyState.tsx";
import { kindMeta } from "../content/presentation.ts";
import { itemById } from "../data/catalog.ts";
import { formatHoursMinutes } from "../lib/format-duration.ts";
import { avoidedLabels, matchingSeedNames } from "../lib/match-taste.ts";
import { paths } from "../routing/paths.ts";
import { useSession } from "../state/SessionContext.tsx";

export function ItemDetailScreen({ itemId }: { itemId: string }) {
  const { draft } = useSession();
  const item = itemById(itemId);

  if (!item) {
    return (
      <div data-screen="item">
        <EmptyState
          heading="h1"
          title="That piece is not on the shelf"
          body="The sample shelf does not have this title."
          href={paths.kit}
          action="Back to the kit"
        />
      </div>
    );
  }

  const meta = kindMeta[item.kind];

  return (
    <div className="flex flex-col gap-8" data-screen="item">
      <GlassLink href={paths.kit} tone="quiet" className="w-full">
        Back to the kit
      </GlassLink>
      <ScreenIntro
        hero={formatHoursMinutes(item.minutes)}
        caption={meta.label}
        title={item.title}
        lede={item.maker}
      />
      <GlassPanel>
        <div className="flex flex-col gap-4">
          <SectionHeading>Why this one</SectionHeading>
          <BecauseList names={matchingSeedNames(item, draft)} />
          <p className="text-lg leading-relaxed">{item.why}</p>
        </div>
      </GlassPanel>
      <GlassPanel>
        <div className="flex flex-col gap-4">
          <SectionHeading>The piece</SectionHeading>
          <p className="text-lg leading-relaxed">{item.synopsis}</p>
        </div>
      </GlassPanel>
      <GlassPanel>
        <div className="flex flex-col gap-4">
          <SectionHeading>Checked again</SectionHeading>
          <p className="text-lg leading-relaxed">
            A second pass reads the title and the description against the themes you marked.
          </p>
          <AvoidedRow labels={avoidedLabels(item, draft)} />
        </div>
      </GlassPanel>
    </div>
  );
}
