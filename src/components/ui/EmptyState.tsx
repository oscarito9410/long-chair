import { GlassLink } from "../glass/GlassLink.tsx";
import { GlassPanel } from "../glass/GlassPanel.tsx";
import { Icon } from "./Icon.tsx";
import { IconWell } from "./IconWell.tsx";

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
    <GlassPanel>
      <div className="flex flex-col items-center gap-6 text-center">
        <IconWell hue="seaglass">
          <Icon name="chair" />
        </IconWell>
        <TitleTag className="text-2xl font-bold">{title}</TitleTag>
        <p className="text-lg leading-relaxed">{body}</p>
        <GlassLink href={href}>{action}</GlassLink>
      </div>
    </GlassPanel>
  );
}
