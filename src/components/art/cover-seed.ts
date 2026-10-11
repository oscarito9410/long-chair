export function coverNumbers(seed: string): readonly [number, number, number, number] {
  let hash = 2166136261;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  const pick = (shift: number) => (hash >>> shift) & 255;
  return [pick(0), pick(8), pick(16), pick(24)];
}

export function coverLines(title: string, max: number): string[] {
  const words = title.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current.length > 0 ? `${current} ${word}` : word;
    if (next.length > max && current.length > 0) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current.length > 0) {
    lines.push(current);
  }
  return lines.slice(0, 3);
}
