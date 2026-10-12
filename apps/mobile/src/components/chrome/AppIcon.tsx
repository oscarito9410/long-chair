import type { SFSymbol } from "expo-symbols";
import { SymbolView } from "expo-symbols";
import {
  Armchair,
  ArrowLeft,
  BookOpen,
  Check,
  Clapperboard,
  Clock,
  Coffee,
  Columns2,
  CookingPot,
  Volleyball,
  Croissant,
  Headphones,
  Layers,
  MapPin,
  MessageCircle,
  Music,
  Pause,
  Settings,
  Shield,
  Soup,
  Tv,
  X,
  type LucideIcon,
} from "lucide-react-native";
import { Platform } from "react-native";

import type { IconName } from "./icon-names";

const STROKE = 1.75;

const glyphs: Record<IconName, LucideIcon> = {
  film: Clapperboard,
  screen: Tv,
  headphones: Headphones,
  book: BookOpen,
  note: Music,
  clock: Clock,
  aside: Shield,
  pin: MapPin,
  chat: MessageCircle,
  check: Check,
  arrow: ArrowLeft,
  stack: Layers,
  split: Columns2,
  bread: Croissant,
  bowl: Soup,
  cup: Coffee,
  chair: Armchair,
  pause: Pause,
  x: X,
  gear: Settings,
  ball: Volleyball,
  pan: CookingPot,
};

const symbols: Record<IconName, SFSymbol> = {
  film: "film",
  screen: "tv",
  headphones: "headphones",
  book: "book",
  note: "music.note",
  clock: "clock",
  aside: "text.bubble",
  pin: "mappin",
  chat: "bubble.left",
  check: "checkmark",
  arrow: "arrow.left",
  stack: "square.stack",
  split: "rectangle.split.2x1",
  bread: "fork.knife",
  bowl: "fork.knife",
  cup: "cup.and.saucer",
  chair: "chair.lounge",
  pause: "pause",
  x: "xmark",
  gear: "gearshape",
  ball: "soccerball",
  pan: "frying.pan",
};

export function AppIcon({
  name,
  color,
  size = 24,
}: {
  name: IconName;
  color: string;
  size?: number;
}) {
  if (Platform.OS === "ios") {
    return <SymbolView name={symbols[name]} tintColor={color} size={size} />;
  }
  const Glyph = glyphs[name];
  return <Glyph color={color} size={size} strokeWidth={STROKE} />;
}
