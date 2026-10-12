import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  addCustomTheme,
  customThemesOf,
  demoDraft,
  openingDraft,
  toggleId,
  toggleTaste,
} from "@long-chair/core";
import type { SessionDraft } from "@long-chair/core";

type SessionContextValue = {
  draft: SessionDraft;
  toggleSeed: (id: string) => void;
  toggleAvoid: (id: string) => void;
  setDuration: (minutes: number) => void;
  setCompanion: (id: string) => void;
  beginOnboarding: () => void;
  setSeeds: (ids: readonly string[]) => void;
  addTheme: (label: string) => void;
  removeTheme: (id: string) => void;
  reset: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<SessionDraft>(openingDraft);

  const value = useMemo<SessionContextValue>(
    () => ({
      draft,
      toggleSeed: (id) => {
        setDraft((current) => ({ ...current, seedIds: toggleTaste(current.seedIds, id) }));
      },
      toggleAvoid: (id) => {
        setDraft((current) => ({ ...current, avoidIds: toggleId(current.avoidIds, id) }));
      },
      setDuration: (minutes) => {
        setDraft((current) => ({ ...current, durationMinutes: minutes }));
      },
      setCompanion: (id) => {
        setDraft((current) => ({ ...current, companionId: id }));
      },
      beginOnboarding: () => {
        setDraft((current) => ({
          ...current,
          seedIds: [],
          avoidIds: openingDraft.avoidIds,
          customThemes: [],
        }));
      },
      addTheme: (label) => {
        setDraft((current) => ({
          ...current,
          customThemes: addCustomTheme(customThemesOf(current.customThemes), label),
        }));
      },
      removeTheme: (id) => {
        setDraft((current) => ({
          ...current,
          customThemes: customThemesOf(current.customThemes).filter((theme) => theme.id !== id),
        }));
      },
      setSeeds: (ids) => {
        setDraft((current) => ({ ...current, seedIds: [...ids] }));
      },
      reset: () => {
        setDraft(demoDraft);
      },
    }),
    [draft],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return value;
}
