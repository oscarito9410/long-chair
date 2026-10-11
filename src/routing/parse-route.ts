export type Route =
  | { name: "welcome" }
  | { name: "onboarding" }
  | { name: "building" }
  | { name: "kit" }
  | { name: "companion" }
  | { name: "compare" }
  | { name: "item"; itemId: string }
  | { name: "unknown" };

const itemPrefix = "/item/";

export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#/, "") || "/welcome";
  switch (path) {
    case "/welcome":
    case "/":
      return { name: "welcome" };
    case "/onboarding":
      return { name: "onboarding" };
    case "/building":
      return { name: "building" };
    case "/kit":
      return { name: "kit" };
    case "/companion":
      return { name: "companion" };
    case "/compare":
      return { name: "compare" };
    default:
      break;
  }
  if (path.startsWith(itemPrefix)) {
    const itemId = decodeURIComponent(path.slice(itemPrefix.length));
    if (itemId.length > 0) {
      return { name: "item", itemId };
    }
  }
  return { name: "unknown" };
}

const tabRouteNames = new Set<Route["name"]>(["kit", "item", "companion", "compare"]);

export function showsTabBar(route: Route): boolean {
  return tabRouteNames.has(route.name);
}
