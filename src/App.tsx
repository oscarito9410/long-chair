import { useEffect } from "react";
import { AppShell } from "./components/chrome/AppShell.tsx";
import { documentTitle } from "./routing/document-title.ts";
import { showsTabBar, type Route } from "./routing/parse-route.ts";
import { useRoute } from "./routing/use-route.ts";
import { ScreenOutlet } from "./screens/ScreenOutlet.tsx";
import { SessionProvider } from "./state/SessionContext.tsx";

function routeKey(route: Route): string {
  if (route.name === "item") {
    return `item-${route.itemId}`;
  }
  return route.name;
}

export function App() {
  const route = useRoute();

  useEffect(() => {
    document.title = `${documentTitle(route)} · Long Chair`;
    window.scrollTo(0, 0);
  }, [route]);

  return (
    <SessionProvider>
      <AppShell route={route} showTabs={showsTabBar(route)} showDots={route.name !== "building"}>
        <div key={routeKey(route)} className="screen-enter">
          <ScreenOutlet route={route} />
        </div>
      </AppShell>
    </SessionProvider>
  );
}
