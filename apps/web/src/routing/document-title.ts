import { itemById } from "@long-chair/core";
import type { Route } from "./parse-route.ts";

export function documentTitle(route: Route): string {
  switch (route.name) {
    case "welcome":
      return "Welcome";
    case "love":
      return "What do you love?";
    case "chair":
      return "How long is your chair?";
    case "themes":
      return "What should stay out?";
    case "company":
      return "Who keeps you company?";
    case "building":
      return "Building the kit";
    case "ready":
      return "Your kit is ready";
    case "kit":
      return "Session kit";
    case "companion":
      return "Companion plan";
    case "compare":
      return "Plain model contrast";
    case "settings":
      return "Settings";
    case "item": {
      const item = itemById(route.itemId);
      return item ? item.title : "Piece";
    }
    case "unknown":
      return "Not found";
  }
}
