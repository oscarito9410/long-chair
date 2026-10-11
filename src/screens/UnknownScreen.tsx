import { EmptyState } from "../components/ui/EmptyState.tsx";
import { paths } from "../routing/paths.ts";

export function UnknownScreen() {
  return (
    <div data-screen="unknown">
      <EmptyState
        heading="h1"
        title="That page is not on the chair"
        body="The prototype has a welcome, a plan, a kit, a companion, and a contrast."
        href={paths.welcome}
        action="Back to the start"
      />
    </div>
  );
}
