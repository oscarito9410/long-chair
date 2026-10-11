import { itemById } from "../data/catalog.ts";
import type { Route } from "./parse-route.ts";

export function documentTitle(route: Route): string {
  switch (route.name) {
    case "welcome":
      return "Welcome";
    case "onboarding":
      return "Plan a session";
    case "building":
      return "Building the kit";
    case "kit":
      return "Session kit";
    case "companion":
      return "Companion plan";
    case "compare":
      return "Plain model contrast";
    case "item": {
      const item = itemById(route.itemId);
      return item ? item.title : "Piece";
    }
    case "unknown":
      return "Not found";
  }
}
