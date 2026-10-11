import { cn } from "../../lib/cn.ts";
import type { Route } from "../../routing/parse-route.ts";
import { paths } from "../../routing/paths.ts";
import { GlassSurface } from "../glass/GlassSurface.tsx";
import { glassClass } from "../glass/glass-styles.ts";
import type { IconName } from "../ui/icon-names.ts";
import { Icon } from "../ui/Icon.tsx";

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
  const currentIndex = Math.max(
    0,
    tabs.findIndex((tab) => tabIsCurrent(route, tab.name)),
  );
  return (
    <div className="layer-tab tab-dock">
      <GlassSurface
        variant="bar"
        thickness="thick"
        follow
        className="w-full max-w-[var(--lc-content)]"
      >
        <nav className="relative flex gap-2 p-2" aria-label="Session">
          <span
            className={glassClass({ thickness: "regular", shape: "pill", className: "tab-lens" })}
            style={{ transform: `translateX(calc(${currentIndex} * (100% + var(--lc-space-8))))` }}
            aria-hidden="true"
          />
          {tabs.map((tab) => {
            const current = tabIsCurrent(route, tab.name);
            return (
              <a
                key={tab.name}
                href={tab.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "tab-link relative flex min-h-[var(--lc-target)] flex-1 flex-col items-center justify-center gap-1 rounded-full px-2 text-base sm:flex-row sm:gap-2 sm:text-lg",
                  current ? "font-extrabold" : "font-bold",
                )}
              >
                <Icon name={tab.icon} weight={current ? "bold" : "regular"} />
                {tab.label}
              </a>
            );
          })}
        </nav>
      </GlassSurface>
    </div>
  );
}
