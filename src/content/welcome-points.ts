import type { IconName } from "../components/ui/icon-names.ts";
import type { Hue } from "../tokens/tokens.ts";

export type WelcomePoint = {
  id: string;
  hue: Hue;
  icon: IconName;
  title: string;
  body: string;
};

export const welcomePoints: readonly WelcomePoint[] = [
  {
    id: "taste",
    hue: "apricot",
    icon: "chair",
    title: "Your taste, not a chart",
    body: "A few films, shows, books, podcasts, or records. No diagnosis, no file, no name.",
  },
  {
    id: "themes",
    hue: "wisteria",
    icon: "aside",
    title: "Themes you can leave out",
    body: "Illness, hospitals, grief, and the other threads you do not want in the room.",
  },
  {
    id: "company",
    hue: "seaglass",
    icon: "chat",
    title: "Company, planned",
    body: "Conversation for the person beside you, and a few places to eat that are open.",
  },
];
