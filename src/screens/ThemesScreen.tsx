import { QuestionFrame } from "../components/chrome/QuestionFrame.tsx";
import { OptionRow } from "../components/ui/OptionRow.tsx";
import { themeCharacter } from "../content/presentation.ts";
import { avoidThemes } from "../data/avoid-themes.ts";
import { paths } from "../routing/paths.ts";
import { useSession } from "../state/SessionContext.tsx";

export function ThemesScreen() {
  const { draft, toggleAvoid } = useSession();

  return (
    <QuestionFrame
      screen="themes"
      title="What should stay out of the room?"
      lede="We left out three common ones. Change any."
      primary="Continue"
      primaryHref={paths.company}
      secondary="Skip for now"
      secondaryHref={paths.company}
    >
      {avoidThemes.map((theme) => (
        <OptionRow
          key={theme.id}
          checked={draft.avoidIds.includes(theme.id)}
          onChange={() => {
            toggleAvoid(theme.id);
          }}
          title={theme.label}
          detail={theme.detail}
          selectedLabel="Left out"
          character={themeCharacter(theme.id)}
        />
      ))}
    </QuestionFrame>
  );
}
