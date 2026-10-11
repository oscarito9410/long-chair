import { useMemo } from "react";
import type { PackedSession } from "../data/types.ts";
import { packSession } from "../lib/pack-session.ts";
import { useSession } from "../state/SessionContext.tsx";

export function usePackedSession(): PackedSession {
  const { draft } = useSession();
  return useMemo(() => packSession(draft), [draft]);
}
