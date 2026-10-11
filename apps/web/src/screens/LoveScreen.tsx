import { QuestionFrame } from "../components/chrome/QuestionFrame.tsx";
import { TastePicker } from "../components/taste/TastePicker.tsx";
import { canContinueTastes, loveLede } from "@long-chair/core";
import { paths } from "../routing/paths.ts";
import { useSession } from "../state/SessionContext.tsx";

export function LoveScreen() {
  const { draft, toggleSeed } = useSession();
  const ready = canContinueTastes(draft.seedIds.length);

  return (
    <QuestionFrame
      screen="love"
      title="What do you love?"
      lede={loveLede}
      primary="Continue"
      primaryHref={paths.chair}
      primaryDisabled={!ready}
      secondary="Skip for now"
      secondaryHref={paths.chair}
    >
      <TastePicker selectedIds={draft.seedIds} onToggle={toggleSeed} />
    </QuestionFrame>
  );
}
