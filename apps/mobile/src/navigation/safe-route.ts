const rejected = new Set(["", "undefined", "null"]);

function firstParam(id: string | readonly string[] | undefined): string | undefined {
  if (typeof id === "string" || id === undefined) {
    return id;
  }
  const [head] = id;
  return head;
}

export function itemIdFromParams(id: string | readonly string[] | undefined): string {
  const value = firstParam(id);
  if (typeof value !== "string") {
    return "";
  }
  const trimmed = value.trim();
  if (rejected.has(trimmed) || trimmed.includes("/") || trimmed.includes("..")) {
    return "";
  }
  return trimmed;
}

export function itemPath(id: string): `/item/${string}` | null {
  const safe = itemIdFromParams(id);
  if (!safe) {
    return null;
  }
  return `/item/${encodeURIComponent(safe)}`;
}
