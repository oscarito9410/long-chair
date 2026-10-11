import type { IconName } from "../ui/icon-names.ts";
import { Icon } from "../ui/Icon.tsx";
import { GlassSurface } from "../glass/GlassSurface.tsx";

export function CoverBadge({ icon, label }: { icon: IconName; label: string }) {
  return (
    <GlassSurface
      variant="badge"
      thickness="regular"
      className="cover-badge flex items-center gap-2 px-4 py-2"
    >
      <Icon name={icon} />
      <span className="text-base font-bold">{label}</span>
    </GlassSurface>
  );
}
