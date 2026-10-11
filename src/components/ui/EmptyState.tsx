import { Character } from "../art/Character.tsx";
import { GlassLink } from "../glass/GlassLink.tsx";
import { SampleNote } from "./SampleNote.tsx";

type EmptyStateProps = {
  heading?: "h1" | "h2";
  title: string;
  body: string;
  href: string;
  action: string;
};

export function EmptyState({ heading = "h2", title, body, href, action }: EmptyStateProps) {
  const TitleTag = heading;
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <SampleNote />
      <Character variant={{ shape: "pebble", hue: "seaglass" }} size="lg" animate />
      <TitleTag className="text-2xl font-bold">{title}</TitleTag>
      <p className="text-lg leading-relaxed">{body}</p>
      <GlassLink href={href} className="w-full">
        {action}
      </GlassLink>
    </div>
  );
}
