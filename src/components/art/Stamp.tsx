import type { Hue } from "../../tokens/tokens.ts";
import { CoverArt } from "./CoverArt.tsx";

export function Stamp({
  seed,
  title,
  hue,
  caption,
  detail,
}: {
  seed: string;
  title: string;
  hue: Hue;
  caption: string;
  detail: string;
}) {
  return (
    <figure className="stamp">
      <div className="stamp-art">
        <CoverArt seed={seed} title={title} hue={hue} frame="square" />
      </div>
      <figcaption className="mt-4 flex flex-col gap-1 text-center">
        <span className="text-base font-bold">{caption}</span>
        <span className="text-lg font-bold">{detail}</span>
      </figcaption>
    </figure>
  );
}
