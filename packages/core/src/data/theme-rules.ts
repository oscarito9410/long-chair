export const builtInThemeIds = ["illness", "hospitals", "cancer", "parent-death", "grief"] as const;

export type BuiltInThemeId = (typeof builtInThemeIds)[number];

export type ThemeRule = {
  id: BuiltInThemeId;
  tagIds: readonly string[];
  tagNames: readonly string[];
  keywords: readonly string[];
};

/**
 * Sample rules. Tag ids are placeholders until a live Qloo tag list is confirmed.
 * Keywords cover English and Spanish synopsis text.
 */
export const themeRules: readonly ThemeRule[] = [
  {
    id: "illness",
    tagIds: ["urn:tag:sample:illness"],
    tagNames: ["medical drama", "illness"],
    keywords: ["illness", "sick", "disease", "diagnosis", "enfermedad", "enfermo", "diagnostico"],
  },
  {
    id: "hospitals",
    tagIds: ["urn:tag:sample:hospital"],
    tagNames: ["hospital"],
    keywords: ["hospital", "ward", "clinic", "clinica", "sala de espera"],
  },
  {
    id: "cancer",
    tagIds: ["urn:tag:sample:cancer"],
    tagNames: ["cancer"],
    keywords: ["cancer", "chemotherapy", "tumor", "oncologist", "quimioterapia"],
  },
  {
    id: "parent-death",
    tagIds: ["urn:tag:sample:parent-death"],
    tagNames: ["death of a parent"],
    keywords: [
      "mother died",
      "father died",
      "lost her mother",
      "lost his father",
      "muerte de la madre",
      "muerte del padre",
    ],
  },
  {
    id: "grief",
    tagIds: ["urn:tag:sample:grief"],
    tagNames: ["grief", "mourning"],
    keywords: ["grief", "mourning", "funeral", "duelo", "luto"],
  },
];

export function themeRuleById(id: string): ThemeRule | undefined {
  return themeRules.find((rule) => rule.id === id);
}
