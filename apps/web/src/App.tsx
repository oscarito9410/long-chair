import { useEffect, useRef } from "react";
import { AppShell } from "./components/chrome/AppShell.tsx";
import { usePackedSession } from "./hooks/use-packed-session.ts";
import { kitSnapshot, rememberKit } from "./lib/kit-snapshot.ts";
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

function staysOnKit(name: Route["name"]): boolean {
  return name === "kit" || name === "item";
}

export function App() {
  const route = useRoute();
  const previous = useRef(route.name);

  useEffect(() => {
    const sync = () => {
      document.documentElement.classList.toggle("is-hidden", document.hidden);
    };
    document.addEventListener("visibilitychange", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    document.title = `${documentTitle(route)} · Long Chair`;
    const fromKit = staysOnKit(previous.current);
    previous.current = route.name;
    if (fromKit && staysOnKit(route.name)) {
      return;
    }
    document.querySelector(".page")?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [route]);

  return (
    <SessionProvider>
      <RememberKit />
      <AppShell route={route} showTabs={showsTabBar(route)} showDots>
        <div key={routeKey(route)} className="screen-enter">
          <ScreenOutlet route={route} />
        </div>
      </AppShell>
    </SessionProvider>
  );
}

function RememberKit() {
  const packed = usePackedSession();

  useEffect(() => {
    rememberKit(kitSnapshot(packed));
  }, [packed]);

  return null;
}
