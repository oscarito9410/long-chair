import { useMemo } from "react";
import type { PackedSession } from "@long-chair/core";
import { packSession } from "@long-chair/core";
import { useSession } from "../state/SessionContext.tsx";

export function usePackedSession(): PackedSession {
  const { draft } = useSession();
  return useMemo(() => packSession(draft), [draft]);
}
