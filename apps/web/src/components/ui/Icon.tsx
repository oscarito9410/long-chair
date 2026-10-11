import {
  Armchair,
  ArrowLeft,
  BookOpen,
  Check,
  Clapperboard,
  Clock,
  Coffee,
  Columns2,
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
} from "lucide-react";
import type { IconName } from "./icon-names.ts";

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
};

const strokeWidth = {
  regular: 1.75,
  bold: 2.5,
} as const;

export function Icon({
  name,
  weight = "regular",
}: {
  name: IconName;
  weight?: keyof typeof strokeWidth;
}) {
  const Glyph = glyphs[name];
  return (
    <Glyph
      aria-hidden
      focusable="false"
      strokeWidth={strokeWidth[weight]}
      style={{ width: "var(--lc-icon)", height: "var(--lc-icon)" }}
    />
  );
}
