import type { Route } from "../routing/parse-route.ts";
import { BuildingScreen } from "./BuildingScreen.tsx";
import { ChairScreen } from "./ChairScreen.tsx";
import { CompanionScreen } from "./CompanionScreen.tsx";
import { CompanyScreen } from "./CompanyScreen.tsx";
import { CompareScreen } from "./CompareScreen.tsx";
import { ItemDetailScreen } from "./ItemDetailScreen.tsx";
import { KitScreen } from "./KitScreen.tsx";
import { LoveScreen } from "./LoveScreen.tsx";
import { ReadyScreen } from "./ReadyScreen.tsx";
import { ThemesScreen } from "./ThemesScreen.tsx";
import { UnknownScreen } from "./UnknownScreen.tsx";
import { WelcomeScreen } from "./WelcomeScreen.tsx";

export function ScreenOutlet({ route }: { route: Route }) {
  switch (route.name) {
    case "welcome":
      return <WelcomeScreen />;
    case "love":
      return <LoveScreen />;
    case "chair":
      return <ChairScreen />;
    case "themes":
      return <ThemesScreen />;
    case "company":
      return <CompanyScreen />;
    case "building":
      return <BuildingScreen />;
    case "ready":
      return <ReadyScreen />;
    case "kit":
      return <KitScreen />;
    case "item":
      return (
        <>
          <div inert>
            <KitScreen />
          </div>
          <ItemDetailScreen itemId={route.itemId} />
        </>
      );
    case "companion":
      return <CompanionScreen />;
    case "compare":
      return <CompareScreen />;
    case "unknown":
      return <UnknownScreen />;
  }
}
