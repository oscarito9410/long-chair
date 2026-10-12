import { characterShapes, expressions, hues, type Expression } from "@long-chair/core";
import { Character } from "../components/art/Character.tsx";

const labels: Record<Expression, string> = {
  calm: "Calm",
  attention: "Attention",
  thinking: "Thinking",
  support: "Support",
  greeting: "Greeting",
  celebration: "Celebration",
  determined: "Determined",
  sleepy: "Sleepy",
  tickled: "Tickled",
};

export function ExpressionsScreen() {
  return (
    <div className="flex flex-col gap-8" data-screen="expressions">
      <h1 className="text-4xl font-extrabold leading-tight">Expressions</h1>
      <p className="text-lg">
        Every shape in every pose. This page stays out of the release build.
      </p>
      {expressions.map((expression) => (
        <section key={expression} className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">{labels[expression]}</h2>
          <div className="expression-sheet">
            {characterShapes.map((shape, index) => (
              <Character
                key={`${expression}-${shape}`}
                variant={{ shape, hue: hues[index % hues.length] ?? "apricot" }}
                expression={expression}
                size="sm"
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
