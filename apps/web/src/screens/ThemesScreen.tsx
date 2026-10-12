import { useState } from "react";
import { QuestionFrame } from "../components/chrome/QuestionFrame.tsx";
import { OptionRow } from "../components/ui/OptionRow.tsx";
import { ONBOARDING_DOT_COUNT, onboardingProgress } from "../content/onboarding.ts";
import { themeCharacter } from "../content/presentation.ts";
import { addThemeLabel, addThemePlaceholder, avoidThemes, customThemesOf, themesLede, themesNote } from "@long-chair/core";
import { paths } from "../routing/paths.ts";
import { useSession } from "../state/SessionContext.tsx";

export function ThemesScreen() {
  const { draft, toggleAvoid, addTheme, removeTheme } = useSession();
  const [label, setLabel] = useState("");
  const custom = customThemesOf(draft.customThemes);

  return (
    <QuestionFrame
      screen="themes"
      title="What should stay out of the room?"
      lede={themesLede}
      note={themesNote}
      primary="Continue"
      primaryHref={paths.company}
      secondary="Skip for now"
      secondaryHref={paths.company}
      progress={{ ...onboardingProgress.themes, total: ONBOARDING_DOT_COUNT }}
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
      <form
        className="theme-add"
        onSubmit={(event) => {
          event.preventDefault();
          addTheme(label);
          setLabel("");
        }}
      >
        <label>
          <span className="visually-hidden">{addThemeLabel}</span>
          <input
            className="taste-field"
            value={label}
            placeholder={addThemePlaceholder}
            onChange={(event) => {
              setLabel(event.target.value);
            }}
          />
        </label>
        <button type="submit" className="theme-add-button">
          {addThemeLabel}
        </button>
      </form>
      <ul className="theme-custom" aria-label="Custom themes">
        {custom.map((theme) => (
          <li key={theme.id}>
            <button
              type="button"
              className="theme-custom-chip"
              onClick={() => {
                removeTheme(theme.id);
              }}
            >
              {theme.label}
              <span>Keyword only, lower confidence</span>
            </button>
          </li>
        ))}
      </ul>
    </QuestionFrame>
  );
}
