import type { ReactNode } from "react";
import { cn } from "../../lib/cn.ts";
import type { Route } from "../../routing/parse-route.ts";
import type { DotMode } from "../../tokens/tokens.ts";
import { DotField } from "../background/DotField.tsx";
import { SoftBlobs } from "../background/SoftBlobs.tsx";
import { PrototypeBanner } from "./PrototypeBanner.tsx";
import { TabBar } from "./TabBar.tsx";

type AppShellProps = {
  children: ReactNode;
  route: Route;
  showTabs: boolean;
  dotMode: DotMode;
};

export function AppShell({ children, route, showTabs, dotMode }: AppShellProps) {
  return (
    <div className="relative min-h-dvh bg-page text-ink">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="layer-bg">
        <SoftBlobs />
        <DotField mode={dotMode} />
      </div>
      <div className={cn("layer-content page", showTabs ? "page-pad-tabs" : "page-pad")}>
        <PrototypeBanner />
        <main id="main">{children}</main>
      </div>
      {showTabs ? <TabBar route={route} /> : null}
    </div>
  );
}
