import { Stamp } from "../components/art/Stamp.tsx";
import { CoverArt } from "../components/art/CoverArt.tsx";
import { QuestionFrame } from "../components/chrome/QuestionFrame.tsx";
import { kindMeta } from "../content/presentation.ts";
import { itemById } from "../data/catalog.ts";
import type { PackedSession } from "../data/types.ts";
import { usePackedSession } from "../hooks/use-packed-session.ts";
import { kitStampLine } from "../lib/kit-stamp.ts";
import { paths } from "../routing/paths.ts";

const fanLimit = 3;

export function ReadyScreen() {
  const packed = usePackedSession();
  const firstId = packed.slots[0]?.itemId;
  const item = firstId ? itemById(firstId) : undefined;
  const hue = item ? kindMeta[item.kind].hue : "apricot";

  return (
    <QuestionFrame
      screen="ready"
      title="Your kit is ready"
      primary="Open my kit"
      primaryHref={paths.kit}
      dock
    >
      <div className="stamp-stage">
        <StampFan packed={packed} />
        <Stamp
          seed={item?.id ?? "quiet-chair"}
          title={item?.title ?? "A quiet chair"}
          hue={hue}
          kind={item?.kind ?? "movie"}
          line={kitStampLine(packed.slots.length, packed.durationMinutes)}
        />
      </div>
    </QuestionFrame>
  );
}

function StampFan({ packed }: { packed: PackedSession }) {
  const behind = packed.slots.slice(1, fanLimit + 1);
  return (
    <>
      {behind.map((slot, index) => {
        const fanItem = itemById(slot.itemId);
        if (!fanItem) {
          return null;
        }
        const meta = kindMeta[fanItem.kind];
        return (
          <div key={fanItem.id} className={`stamp-fan stamp-fan-${index}`} aria-hidden="true">
            <CoverArt
              seed={fanItem.id}
              title={fanItem.title}
              hue={meta.hue}
              kind={fanItem.kind}
              frame="square"
              decorative
            />
          </div>
        );
      })}
    </>
  );
}
