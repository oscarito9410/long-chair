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
};

export function Icon({ name }: { name: IconName }) {
  const Glyph = glyphs[name];
  return (
    <Glyph
      aria-hidden
      focusable="false"
      strokeWidth={1.75}
      style={{ width: "var(--lc-icon)", height: "var(--lc-icon)" }}
    />
  );
}
