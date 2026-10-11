const saltSpan = 80;
const saltModulus = 997;

export function coverSalt(seed: string): readonly [number, number, number] {
  let hash = 0;
  for (const char of seed) {
    hash = (hash * saltModulus + char.charCodeAt(0)) % saltModulus;
  }
  return [hash % saltSpan, (hash * 3) % saltSpan, (hash * 7) % saltSpan];
}
