export const regionCodes = ["MX", "US", "BR", "ES", "GB", "IN", "GLOBAL"] as const;

export type RegionCode = (typeof regionCodes)[number];

export const regionNames: Record<RegionCode, string> = {
  MX: "Mexico",
  US: "United States",
  BR: "Brazil",
  ES: "Spain",
  GB: "United Kingdom",
  IN: "India",
  GLOBAL: "Global",
};

const supported = new Set<string>(regionCodes);

export function isRegionCode(value: string | null | undefined): value is RegionCode {
  return typeof value === "string" && supported.has(value);
}

/**
 * Region comes from a locale tag such as es-MX or en-US.
 * A language with no country, or a country we do not seed, falls back to Global.
 */
export function regionFromLocale(locale: string | undefined): RegionCode {
  if (!locale) {
    return "GLOBAL";
  }
  const parts = locale
    .replaceAll("_", "-")
    .split("-")
    .filter((part) => part.length > 0);
  const country = parts.length > 1 ? parts[parts.length - 1]?.toUpperCase() : undefined;
  if (country && isRegionCode(country)) {
    return country;
  }
  return "GLOBAL";
}
