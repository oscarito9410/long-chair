import { cn } from "../../lib/cn.ts";
import type { Route } from "../../routing/parse-route.ts";
import { paths } from "../../routing/paths.ts";
import type { IconName } from "../ui/icon-names.ts";
import { Icon } from "../ui/Icon.tsx";
import { Specular } from "../glass/Specular.tsx";

const tabs: readonly {
  href: string;
  label: string;
  icon: IconName;
  name: "kit" | "companion" | "compare";
}[] = [
  { href: paths.kit, label: "Kit", icon: "stack", name: "kit" },
  { href: paths.companion, label: "Companion", icon: "chat", name: "companion" },
  { href: paths.compare, label: "Compare", icon: "split", name: "compare" },
];

function tabIsCurrent(route: Route, name: (typeof tabs)[number]["name"]): boolean {
  if (name === "kit") {
    return route.name === "kit" || route.name === "item";
  }
  return route.name === name;
}

export function TabBar({ route }: { route: Route }) {
  return (
    <div className="layer-tab tab-dock">
      <nav
        className="glass relative flex w-full max-w-[var(--lc-content)] gap-2 overflow-hidden rounded-full p-2"
        aria-label="Session"
      >
        <Specular />
        {tabs.map((tab) => {
          const current = tabIsCurrent(route, tab.name);
          return (
            <a
              key={tab.name}
              href={tab.href}
              aria-current={current ? "page" : undefined}
              className={cn(
                "relative flex min-h-[var(--lc-target)] flex-1 flex-col items-center justify-center gap-1 rounded-full px-2 text-base font-bold sm:flex-row sm:gap-2 sm:text-lg",
                current ? "wash-seaglass text-ink" : "text-ink",
              )}
            >
              <Icon name={tab.icon} />
              {tab.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
