import type { PackedSession } from "../data/types.ts";

export const kitCacheName = "long-chair-kit";
export const kitSnapshotPath = "/long-chair-kit.json";

export function kitSnapshot(packed: PackedSession): string {
  return JSON.stringify(packed);
}

export function rememberKit(snapshot: string): void {
  if (typeof caches === "undefined") {
    return;
  }
  void caches
    .open(kitCacheName)
    .then((cache) =>
      cache.put(
        kitSnapshotPath,
        new Response(snapshot, { headers: { "Content-Type": "application/json" } }),
      ),
    )
    .then(
      () => undefined,
      () => undefined,
    );
}
