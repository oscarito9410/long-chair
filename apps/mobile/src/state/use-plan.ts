import { useEffect, useState } from "react";
import { createKitService } from "@long-chair/core";
import type { SessionDraft, SessionPlan } from "@long-chair/core";

import { planFailed } from "../copy/phrases";

type EnvHost = { process?: { env?: Record<string, string | undefined> } };

function readApiUrl(): string | undefined {
  const host = globalThis as EnvHost;
  const value = host.process?.env?.EXPO_PUBLIC_API_URL;
  return typeof value === "string" ? value : undefined;
}

const kitService = createKitService(readApiUrl());

type Snapshot = {
  draft: SessionDraft;
  plan: SessionPlan | null;
  error: string | null;
};

export function usePlan(draft: SessionDraft): {
  plan: SessionPlan | null;
  loading: boolean;
  error: string | null;
} {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  useEffect(() => {
    let active = true;
    kitService.plan(draft).then(
      (next) => {
        if (active) {
          setSnapshot({ draft, plan: next, error: null });
        }
      },
      (reason: unknown) => {
        if (active) {
          const message = reason instanceof Error ? reason.message : planFailed;
          setSnapshot({ draft, plan: null, error: message });
        }
      },
    );
    return () => {
      active = false;
    };
  }, [draft]);

  const current = snapshot?.draft === draft ? snapshot : null;
  return {
    plan: current?.plan ?? null,
    loading: current === null,
    error: current?.error ?? null,
  };
}
