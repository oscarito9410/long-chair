import {
  idleTickle,
  isTickling,
  noteTickleTap,
  TICKLE_GIGGLE_MS,
  type TickleClock,
} from "@long-chair/core";
import { useCallback, useEffect, useState } from "react";

export function useTickle() {
  const [clock, setClock] = useState<TickleClock>(idleTickle);
  const [now, setNow] = useState(0);
  const tickling = isTickling(clock, now);

  useEffect(() => {
    if (clock.giggleUntil === null) {
      return;
    }
    const wait = clock.giggleUntil - Date.now();
    const timer = window.setTimeout(
      () => {
        setNow(Date.now());
      },
      Math.max(wait, 0),
    );
    return () => {
      window.clearTimeout(timer);
    };
  }, [clock.giggleUntil]);

  const tap = useCallback(() => {
    const at = Date.now();
    setNow(at);
    setClock((current) => noteTickleTap(current, at));
  }, []);

  const force = useCallback(() => {
    const at = Date.now();
    setNow(at);
    setClock({ taps: [], giggleUntil: at + TICKLE_GIGGLE_MS });
  }, []);

  return { tickling, tap, force };
}
