import { CoverArt } from "../components/art/CoverArt.tsx";
import { GlassLink } from "../components/glass/GlassLink.tsx";
import { GlassSurface } from "../components/glass/GlassSurface.tsx";
import { SectionHeading } from "../components/ui/SectionHeading.tsx";
import { AvoidedRow } from "../components/ui/AvoidedRow.tsx";
import { BecauseList } from "../components/ui/BecauseList.tsx";
import { EmptyState } from "../components/ui/EmptyState.tsx";
import { Icon } from "../components/ui/Icon.tsx";
import { SampleNote } from "../components/ui/SampleNote.tsx";
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
    <div className="flex flex-col gap-6" data-screen="item">
      <GlassLink href={paths.kit} tone="quiet" className="w-full">
        <Icon name="arrow" />
        Back to the kit
      </GlassLink>
      <div className="cover-frame">
        <CoverArt
          seed={item.id}
          title={item.title}
          hue={meta.hue}
          kind={item.kind}
          frame="poster"
          decorative
        />
        <GlassSurface variant="badge" thickness="thin" className="cover-badge px-4 py-2">
          <span className="text-lg font-bold">{formatHoursMinutes(item.minutes)}</span>
        </GlassSurface>
      </div>
      <GlassSurface
        variant="sheet"
        thickness="thick"
        className="detail-sheet flex flex-col gap-6 p-6"
      >
        <SampleNote />
        <div>
          <p className="text-lg font-bold">{meta.label}</p>
          <h1 className="text-4xl font-extrabold leading-tight">{item.title}</h1>
          <p className="mt-2 text-lg">{item.maker}</p>
        </div>
        <div className="flex flex-col gap-4">
          <SectionHeading>Why this one</SectionHeading>
          <BecauseList names={matchingSeedNames(item, draft)} />
          <p className="text-lg leading-relaxed">{item.why}</p>
        </div>
        <div className="flex flex-col gap-4">
          <SectionHeading>The piece</SectionHeading>
          <p className="text-lg leading-relaxed">{item.synopsis}</p>
        </div>
        <div className="flex flex-col gap-4">
          <SectionHeading>Checked again</SectionHeading>
          <p className="text-lg leading-relaxed">
            A second pass reads the title and the description against the themes you marked.
          </p>
          <AvoidedRow labels={avoidedLabels(item, draft)} />
        </div>
      </GlassSurface>
    </div>
  );
}
