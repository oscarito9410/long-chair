import { EmptyState } from "../components/ui/EmptyState.tsx";
import { paths } from "../routing/paths.ts";

export function UnknownScreen() {
  return (
    <div data-screen="unknown">
      <EmptyState
        heading="h1"
        title="We couldn't find that page"
        href={paths.welcome}
        action="Back to the start"
      />
    </div>
  );
}
