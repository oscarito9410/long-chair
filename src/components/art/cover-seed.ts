export function coverNumbers(seed: string): readonly [number, number, number, number] {
  let hash = 2166136261;
  for (const char of seed) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  const pick = (shift: number) => (hash >>> shift) & 255;
  return [pick(0), pick(8), pick(16), pick(24)];
}
