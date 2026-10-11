import { GlassLink } from "../components/glass/GlassLink.tsx";
import { SampleNote } from "../components/ui/SampleNote.tsx";
import type { Hue } from "../tokens/tokens.ts";
import { paths } from "../routing/paths.ts";

const notes: readonly { text: string; className: string; tint: Hue }[] = [
  { text: "jazz on Sundays", className: "note-a", tint: "honey" },
  { text: "cozy mysteries", className: "note-b", tint: "apricot" },
  { text: "slow bread", className: "note-c", tint: "seaglass" },
  { text: "window light", className: "note-d", tint: "wisteria" },
];

export function WelcomeScreen() {
  return (
    <div className="question" data-screen="welcome">
      <SampleNote />
      <div className="welcome-stage">
        {notes.map((note) => (
          <p
            key={note.text}
            className={`sticker sticker-${note.tint} hand ${note.className}`}
            aria-hidden="true"
          >
            {note.text}
          </p>
        ))}
        <div className="welcome-copy">
          <h1 className="text-4xl font-extrabold leading-tight">
            What you love, minus what hurts.
          </h1>
          <p className="text-lg leading-relaxed">A kit cut to the length of your chair.</p>
        </div>
        <svg viewBox="0 0 72 88" className="welcome-arrow" aria-hidden="true">
          <path
            d="M36 6c-6 18 8 22-2 40"
            fill="none"
            stroke="var(--lc-ink)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M20 58c8 10 16 16 16 22 0-6 8-12 16-22"
            fill="none"
            stroke="var(--lc-ink)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-col items-center gap-2">
        <GlassLink href={paths.love} className="w-full">
          Get started
        </GlassLink>
        <GlassLink href={paths.kit} tone="quiet" className="w-full">
          See a sample kit
        </GlassLink>
        <p className="text-center text-base">Not medical advice</p>
      </div>
    </div>
  );
}
