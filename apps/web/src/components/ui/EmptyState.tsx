import { cn } from "../../lib/cn.ts";
import { Character } from "../art/Character.tsx";
import { GlassLink } from "../glass/GlassLink.tsx";

type EmptyStateProps = {
  heading?: "h1" | "h2";
  title: string;
  href: string;
  action: string;
};

export function EmptyState({ heading = "h2", title, href, action }: EmptyStateProps) {
  const TitleTag = heading;
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <Character
        variant={{ shape: "pebble", hue: "seaglass" }}
        size="lg"
        expression="sleepy"
        animate
      />
      <TitleTag
        className={cn(
          heading === "h1" ? "text-4xl font-extrabold leading-tight" : "text-2xl font-bold",
        )}
      >
        {title}
      </TitleTag>
      <GlassLink href={href} className="w-full">
        {action}
      </GlassLink>
    </div>
  );
}
