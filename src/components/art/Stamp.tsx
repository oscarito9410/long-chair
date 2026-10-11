import type { ContentKind } from "../../data/types.ts";
import type { Hue } from "../../tokens/tokens.ts";
import { glassClass } from "../glass/glass-styles.ts";
import { CoverArt } from "./CoverArt.tsx";

export function Stamp({
  seed,
  title,
  hue,
  kind = "movie",
  line,
}: {
  seed: string;
  title: string;
  hue: Hue;
  kind?: ContentKind;
  line: string;
}) {
  return (
    <figure className={glassClass({ thickness: "regular", shape: "card", className: "stamp" })}>
      <div className="stamp-art">
        <CoverArt seed={seed} title={title} hue={hue} kind={kind} frame="square" decorative />
      </div>
      <figcaption className="mt-4 text-center text-lg font-bold">{line}</figcaption>
    </figure>
  );
}
