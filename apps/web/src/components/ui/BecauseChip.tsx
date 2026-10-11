import { cn } from "../../lib/cn.ts";
import { tagClass } from "./tag-class.ts";

export function BecauseChip({ name }: { name: string }) {
  return (
    <span className={cn(tagClass, "border border-line bg-page text-ink")}>
      Because you love {name}
    </span>
  );
}
