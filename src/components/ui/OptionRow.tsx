import { cn } from "../../lib/cn.ts";
import type { CharacterVariant } from "../../data/character-kinds.ts";
import { Character } from "../art/Character.tsx";
import { glassClass, onGlassPointerMove } from "../glass/glass-styles.ts";
import { Icon } from "./Icon.tsx";

export function OptionRow({
  checked,
  onChange,
  title,
  detail,
  selectedLabel,
  character,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  detail: string;
  selectedLabel: string;
  character: CharacterVariant;
}) {
  return (
    <button
      type="button"
      className={cn(
        glassClass({ thickness: "regular", shape: "row", press: true }),
        "option-row",
        checked && "is-selected",
      )}
      aria-pressed={checked}
      onPointerMove={onGlassPointerMove}
      onClick={onChange}
    >
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          {checked ? <Icon name="check" /> : null}
          <span className="block text-lg font-bold">{title}</span>
        </span>
        <span className="mt-1 block text-base text-ink-soft">{detail}</span>
        {checked ? <span className="mt-1 block text-lg font-bold">{selectedLabel}</span> : null}
      </span>
      <Character variant={character} />
    </button>
  );
}
