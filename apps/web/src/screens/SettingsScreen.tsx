import { notMedicalAdvice, sampleShelfNote } from "@long-chair/core";
import { controlClass } from "../components/glass/glass-styles.ts";
import { paths } from "../routing/paths.ts";
import { useSession } from "../state/SessionContext.tsx";

const notes = [
  sampleShelfNote,
  "Sample shelf until a live catalog is connected.",
  "Tastes and themes you set aside stay on this phone. This build does not send them.",
  "Long Chair works without an account. There is nothing to sign in to.",
] as const;

export function SettingsScreen() {
  const { reset } = useSession();
  return (
    <div className="question" data-screen="settings">
      <header className="flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold leading-tight">Settings</h1>
        <p className="text-lg leading-relaxed">
          Company and entertainment for a long session. No account.
        </p>
      </header>
      {notes.map((note) => (
        <p key={note} className="text-lg leading-relaxed">
          {note}
        </p>
      ))}
      <button
        type="button"
        className={controlClass("solid", "w-full")}
        onClick={() => {
          reset();
          window.location.hash = paths.kit;
        }}
      >
        See a sample kit
      </button>
      <p className="text-center text-base">{notMedicalAdvice}</p>
    </div>
  );
}
