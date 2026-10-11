import { QuestionFrame } from "../components/chrome/QuestionFrame.tsx";
import { Dial } from "../components/ui/Dial.tsx";
import { ONBOARDING_DOT_COUNT, onboardingProgress } from "../content/onboarding.ts";
import { paths } from "../routing/paths.ts";
import { useSession } from "../state/SessionContext.tsx";

export function ChairScreen() {
  const { draft, setDuration } = useSession();

  return (
    <QuestionFrame
      screen="chair"
      title="How long is your chair?"
      lede="Turn the dial or tap a length."
      primary="Continue"
      primaryHref={paths.themes}
      secondary="You can change this anytime"
      secondaryHref={paths.themes}
      progress={{ ...onboardingProgress.chair, total: ONBOARDING_DOT_COUNT }}
    >
      <Dial minutes={draft.durationMinutes} onChange={setDuration} />
    </QuestionFrame>
  );
}
