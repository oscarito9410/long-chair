import { cn } from "../../lib/cn.ts";
import { tagClass } from "./tag-class.ts";

export function ThemeBadge({ label }: { label: string }) {
  return <span className={cn(tagClass, "wash-wisteria text-ink")}>{label}</span>;
}
