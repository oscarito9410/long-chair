import type { CharacterVariant } from "../../data/character-kinds.ts";
import { Character } from "../art/Character.tsx";
import { glassClass, onGlassPointerMove } from "../glass/glass-styles.ts";

export function TopicCard({
  title,
  prompt,
  character,
}: {
  title: string;
  prompt: string;
  character: CharacterVariant;
}) {
  return (
    <article
      className={glassClass({
        thickness: "regular",
        shape: "row",
        className: "option-row cursor-default",
      })}
      onPointerMove={onGlassPointerMove}
    >
      <div className="min-w-0">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="mt-2 text-lg leading-relaxed">{prompt}</p>
      </div>
      <Character variant={character} />
    </article>
  );
}
