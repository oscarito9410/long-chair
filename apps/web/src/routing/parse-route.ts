export type Route =
  | { name: "welcome" }
  | { name: "love" }
  | { name: "chair" }
  | { name: "themes" }
  | { name: "company" }
  | { name: "building" }
  | { name: "ready" }
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
    case "/love":
      return { name: "love" };
    case "/chair":
      return { name: "chair" };
    case "/themes":
      return { name: "themes" };
    case "/company":
      return { name: "company" };
    case "/building":
      return { name: "building" };
    case "/ready":
      return { name: "ready" };
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
