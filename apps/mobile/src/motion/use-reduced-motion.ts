import { useSyncExternalStore } from "react";
import { AccessibilityInfo, Platform } from "react-native";

const listeners = new Set<() => void>();
let reduced = false;

function publish(next: boolean): void {
  reduced = next;
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function readReduced(): boolean {
  return reduced;
}

function readServerReduced(): boolean {
  return false;
}

if (
  Platform.OS === "web" &&
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function"
) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduced = query.matches;
  query.addEventListener("change", () => {
    publish(query.matches);
  });
} else {
  void AccessibilityInfo.isReduceMotionEnabled().then(publish);
  AccessibilityInfo.addEventListener("reduceMotionChanged", publish);
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, readReduced, readServerReduced);
}
