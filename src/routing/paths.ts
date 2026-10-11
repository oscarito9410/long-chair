export const paths = {
  welcome: "#/welcome",
  onboarding: "#/onboarding",
  building: "#/building",
  kit: "#/kit",
  companion: "#/companion",
  compare: "#/compare",
  item: (id: string) => `#/item/${encodeURIComponent(id)}`,
} as const;
