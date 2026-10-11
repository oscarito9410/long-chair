import { QuestionFrame } from "../components/chrome/QuestionFrame.tsx";
import { Stamp } from "../components/art/Stamp.tsx";
import { kindMeta } from "../content/presentation.ts";
import { itemById } from "../data/catalog.ts";
import { formatHoursMinutes } from "../lib/format-duration.ts";
import { paths } from "../routing/paths.ts";
import { usePackedSession } from "../hooks/use-packed-session.ts";

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
    >
      <Stamp
        seed={item?.id ?? "quiet-chair"}
        title={item?.title ?? "A quiet chair"}
        hue={hue}
        kind={item?.kind ?? "movie"}
        caption="For the chair"
        detail={formatHoursMinutes(packed.durationMinutes)}
      />
    </QuestionFrame>
  );
}
