import type { CharacterVariant } from "@long-chair/core";
import { Character } from "../art/Character.tsx";
import { glassClass } from "../glass/glass-styles.ts";

export function TopicCard({ prompt, character }: { prompt: string; character: CharacterVariant }) {
  return (
    <article
      className={glassClass({
        thickness: "thin",
        shape: "row",
        className: "option-row cursor-default",
      })}
    >
      <h3 className="min-w-0 text-2xl font-bold">{prompt}</h3>
      <Character variant={character} />
    </article>
  );
}
