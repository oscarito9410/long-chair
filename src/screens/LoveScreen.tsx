import { QuestionFrame } from "../components/chrome/QuestionFrame.tsx";
import { OptionRow } from "../components/ui/OptionRow.tsx";
import { tasteCharacter } from "../content/presentation.ts";
import { tasteSeeds } from "../data/taste-seeds.ts";
import { paths } from "../routing/paths.ts";
import { useSession } from "../state/SessionContext.tsx";

export function LoveScreen() {
  const { draft, toggleSeed } = useSession();
  const canContinue = draft.seedIds.length > 0;

  return (
    <QuestionFrame
      screen="love"
      title="What do you love?"
      lede="Tap what belongs in the room."
      primary="Continue"
      primaryHref={paths.chair}
      primaryDisabled={!canContinue}
      secondary="Skip for now"
      secondaryHref={paths.chair}
    >
      {tasteSeeds.map((seed) => (
        <OptionRow
          key={seed.id}
          checked={draft.seedIds.includes(seed.id)}
          onChange={() => {
            toggleSeed(seed.id);
          }}
          title={seed.name}
          detail={seed.detail}
          selectedLabel="In the room"
          character={tasteCharacter(seed.id)}
        />
      ))}
      <p className="visually-hidden" role="status">
        {canContinue ? "A title is in the room." : "Choose one title before you continue."}
      </p>
    </QuestionFrame>
  );
}
