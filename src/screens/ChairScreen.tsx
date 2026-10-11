import { QuestionFrame } from "../components/chrome/QuestionFrame.tsx";
import { Dial } from "../components/ui/Dial.tsx";
import { paths } from "../routing/paths.ts";
import { useSession } from "../state/SessionContext.tsx";

export function ChairScreen() {
  const { draft, setDuration } = useSession();
  const hours = Math.max(1, Math.round(draft.durationMinutes / 60));

  return (
    <QuestionFrame
      screen="chair"
      title="How long is your chair?"
      lede="Drag the dial. The kit will be cut to fit."
      primary="Continue"
      primaryHref={paths.themes}
      secondary="You can change this anytime"
      secondaryHref={paths.themes}
    >
      <Dial
        hours={hours}
        onChange={(next) => {
          setDuration(next * 60);
        }}
      />
    </QuestionFrame>
  );
}
