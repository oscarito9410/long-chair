import type { ContentKind } from "../../data/types.ts";
import type { Hue } from "../../tokens/tokens.ts";
import { glassClass } from "../glass/glass-styles.ts";
import { CoverArt } from "./CoverArt.tsx";

export function Stamp({
  seed,
  title,
  hue,
  kind = "movie",
  caption,
  detail,
}: {
  seed: string;
  title: string;
  hue: Hue;
  kind?: ContentKind;
  caption: string;
  detail: string;
}) {
  return (
    <figure className={glassClass({ thickness: "regular", shape: "card", className: "stamp" })}>
      <div className="stamp-art">
        <CoverArt seed={seed} title={title} hue={hue} kind={kind} frame="square" />
      </div>
      <figcaption className="mt-4 flex flex-col gap-1 text-center">
        <span className="text-base font-bold">{caption}</span>
        <span className="text-lg font-bold">{detail}</span>
      </figcaption>
    </figure>
  );
}
