import { createContext, useContext, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import type { HapticWeight } from "./haptics";

export type OnboardingStore = {
  primary: string;
  primaryDisabled: boolean;
  primaryHaptic: HapticWeight;
  linkLabel?: string;
  footerNote?: string;
};

type Handlers = {
  onPrimary: () => void;
  onLink?: () => void;
};

type ChromeContextValue = {
  store: OnboardingStore;
  setStore: (store: OnboardingStore) => void;
  handlersRef: { current: Handlers };
};

const ChromeContext = createContext<ChromeContextValue | null>(null);

const initialStore: OnboardingStore = {
  primary: "",
  primaryDisabled: false,
  primaryHaptic: "press",
};

export function OnboardingChromeProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<OnboardingStore>(initialStore);
  const handlersRef = useRef<Handlers>({ onPrimary: () => undefined });
  const value = useMemo(() => ({ store, setStore, handlersRef }), [store]);
  return <ChromeContext.Provider value={value}>{children}</ChromeContext.Provider>;
}

export function useOnboardingChrome(input: {
  primary: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  primaryHaptic?: HapticWeight;
  linkLabel?: string;
  onLink?: () => void;
  footerNote?: string;
}): void {
  const chrome = useContext(ChromeContext);
  if (!chrome) {
    throw new Error("Onboarding screens render inside the onboarding frame.");
  }
  const { handlersRef, setStore } = chrome;
  const primaryDisabled = input.primaryDisabled ?? false;
  const primaryHaptic = input.primaryHaptic ?? "press";
  useLayoutEffect(() => {
    handlersRef.current = {
      onPrimary: input.onPrimary,
      onLink: input.onLink,
    };
    setStore({
      primary: input.primary,
      primaryDisabled,
      primaryHaptic,
      linkLabel: input.linkLabel,
      footerNote: input.footerNote,
    });
  }, [
    handlersRef,
    input.footerNote,
    input.linkLabel,
    input.onLink,
    input.onPrimary,
    input.primary,
    primaryDisabled,
    primaryHaptic,
    setStore,
  ]);
}

export function useOnboardingStore(): ChromeContextValue {
  const chrome = useContext(ChromeContext);
  if (!chrome) {
    throw new Error("Onboarding screens render inside the onboarding frame.");
  }
  return chrome;
}
