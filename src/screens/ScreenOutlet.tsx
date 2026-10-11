import type { Route } from "../routing/parse-route.ts";
import { BuildingScreen } from "./BuildingScreen.tsx";
import { CompanionScreen } from "./CompanionScreen.tsx";
import { CompareScreen } from "./CompareScreen.tsx";
import { ItemDetailScreen } from "./ItemDetailScreen.tsx";
import { KitScreen } from "./KitScreen.tsx";
import { OnboardingScreen } from "./OnboardingScreen.tsx";
import { UnknownScreen } from "./UnknownScreen.tsx";
import { WelcomeScreen } from "./WelcomeScreen.tsx";

export function ScreenOutlet({ route }: { route: Route }) {
  switch (route.name) {
    case "welcome":
      return <WelcomeScreen />;
    case "onboarding":
      return <OnboardingScreen />;
    case "building":
      return <BuildingScreen />;
    case "kit":
      return <KitScreen />;
    case "item":
      return <ItemDetailScreen itemId={route.itemId} />;
    case "companion":
      return <CompanionScreen />;
    case "compare":
      return <CompareScreen />;
    case "unknown":
      return <UnknownScreen />;
  }
}
