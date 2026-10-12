import { characterMoods, characterShapes, hues } from "@long-chair/core";
import { Character } from "../components/art/Character.tsx";

export function MarksScreen() {
  return (
    <div className="flex flex-col gap-6" data-screen="marks">
      <h1 className="text-4xl font-extrabold leading-tight">Shapes</h1>
      <p className="text-lg">Seven silhouettes across the four hues.</p>
      <div className="mark-sheet">
        {characterShapes.map((shape, row) =>
          hues.map((hue) => (
            <Character
              key={`${shape}-${hue}`}
              variant={{
                shape,
                hue,
                mood: characterMoods[row % characterMoods.length],
              }}
              size="md"
              animate={row === 0 && hue === "apricot"}
            />
          )),
        )}
      </div>
    </div>
  );
}
