import { useEffect, useState } from "react";
import { notMedicalAdvice, welcomeNotesAt } from "@long-chair/core";
import { controlClass } from "../components/glass/glass-styles.ts";
import { Icon } from "../components/ui/Icon.tsx";
import { SampleNote } from "../components/ui/SampleNote.tsx";
import { useReducedMotion } from "../hooks/use-reduced-motion.ts";
import type { Hue } from "../tokens/tokens.ts";
import { paths } from "../routing/paths.ts";
import { useSession } from "../state/SessionContext.tsx";

const NOTE_CLASS = ["note-a", "note-b", "note-c", "note-d"] as const;
const NOTE_HUE: readonly Hue[] = ["honey", "apricot", "seaglass", "wisteria"];
const WELCOME_NOTE_MS = 3200;

function useWelcomeNotes(): readonly string[] {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) {
      return;
    }
    const id = window.setInterval(() => {
      setStep((current) => current + 1);
    }, WELCOME_NOTE_MS);
    return () => {
      window.clearInterval(id);
    };
  }, [reduced]);

  return welcomeNotesAt(reduced ? 0 : step);
}

export function WelcomeScreen() {
  const notes = useWelcomeNotes();
  const { beginOnboarding, reset } = useSession();
  return (
    <div className="question welcome-screen" data-screen="welcome">
      <a className="welcome-gear glass-surface glass-thin glass-disc" href={paths.settings} aria-label="Settings">
        <Icon name="gear" />
      </a>
      <SampleNote />
      <div className="welcome-stage">
        {notes.map((text, index) => (
          <p
            key={NOTE_CLASS[index] ?? text}
            className={`sticker sticker-${NOTE_HUE[index] ?? "honey"} hand ${NOTE_CLASS[index] ?? "note-a"}`}
            aria-hidden="true"
          >
            {text}
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
      <div className="welcome-dock">
        <a
          href={paths.love}
          className={controlClass("solid", "w-full")}
          onClick={() => {
            beginOnboarding();
          }}
        >
          Get started
        </a>
        <a
          className="text-link"
          href={paths.kit}
          onClick={() => {
            reset();
          }}
        >
          <Icon name="stack" />
          See a sample kit
        </a>
        <p className="text-center text-base">{notMedicalAdvice}</p>
      </div>
    </div>
  );
}
