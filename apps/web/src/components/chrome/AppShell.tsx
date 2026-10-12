import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn.ts";
import type { Route } from "../../routing/parse-route.ts";
import { DotField } from "../background/DotField.tsx";
import { SoftBlobs } from "../background/SoftBlobs.tsx";
import { paths } from "../../routing/paths.ts";
import { Icon } from "../ui/Icon.tsx";
import { TabBar } from "./TabBar.tsx";

const AppWindowContext = createContext<HTMLElement | null>(null);

export function useAppWindow(): HTMLElement | null {
  return useContext(AppWindowContext);
}

type AppShellProps = {
  children: ReactNode;
  route: Route;
  showTabs: boolean;
  showDots: boolean;
};

function pagePad(showTabs: boolean, name: Route["name"]): string {
  if (showTabs) {
    return "page-pad-tabs";
  }
  if (name === "love") {
    return "page-pad-love";
  }
  return "page-pad";
}

export function AppShell({ children, route, showTabs, showDots }: AppShellProps) {
  const [windowEl, setWindowEl] = useState<HTMLDivElement | null>(null);

  return (
    <AppWindowContext.Provider value={windowEl}>
      <div className="app-stage">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="layer-bg">
          <SoftBlobs />
          {showDots ? <DotField mode="ambient" /> : null}
        </div>
        <div className="app-window" id="app-window" ref={setWindowEl}>
          <div className={cn("layer-content page", pagePad(showTabs, route.name))}>
            {showTabs ? (
              <a
                className="tab-gear glass-surface glass-thin glass-disc"
                href={paths.settings}
                aria-label="Settings"
              >
                <Icon name="gear" />
              </a>
            ) : null}
            <main id="main">{children}</main>
          </div>
          {showTabs ? <TabBar route={route} /> : null}
        </div>
      </div>
    </AppWindowContext.Provider>
  );
}
