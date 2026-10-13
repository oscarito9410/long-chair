export const builtInThemeIds = ["illness", "hospitals", "cancer", "parent-death", "grief"] as const;

export type BuiltInThemeId = (typeof builtInThemeIds)[number];

export type ThemeRule = {
  id: BuiltInThemeId;
  tagIds: readonly string[];
  tagPrefixes: readonly string[];
  tagNames: readonly string[];
  keywords: readonly string[];
};

/**
 * Catalog identifiers from issue #11 plus sample compatibility identifiers.
 * Specific parent relations take precedence over the generic death/grief family.
 * Keywords cover English and Spanish synopsis text.
 */
export const themeRules: readonly ThemeRule[] = [
  {
    id: "illness",
    tagIds: [
      "urn:tag:sample:illness",
      "urn:tag:genre:media:illness",
      "urn:tag:theme:qloo:terminal_illness",
    ],
    tagPrefixes: ["urn:tag:genre:media:illness_", "urn:tag:theme:qloo:terminal_illness_"],
    tagNames: ["medical drama", "illness"],
    keywords: ["illness", "sick", "disease", "diagnosis", "enfermedad", "enfermo", "diagnostico"],
  },
  {
    id: "hospitals",
    tagIds: [
      "urn:tag:sample:hospital",
      "urn:tag:keyword:media:hospital",
      "urn:tag:setting:qloo:hospital",
    ],
    tagPrefixes: ["urn:tag:keyword:media:hospital_", "urn:tag:setting:qloo:hospital_"],
    tagNames: ["hospital"],
    keywords: ["hospital", "ward", "clinic", "clinica", "sala de espera"],
  },
  {
    id: "cancer",
    tagIds: ["urn:tag:sample:cancer", "urn:tag:theme:qloo:cancer", "urn:tag:keyword:qloo:cancer"],
    tagPrefixes: ["urn:tag:theme:qloo:cancer_", "urn:tag:keyword:qloo:cancer_"],
    tagNames: ["cancer"],
    keywords: ["cancer", "chemotherapy", "tumor", "oncologist", "quimioterapia"],
  },
  {
    id: "parent-death",
    tagIds: [
      "urn:tag:sample:parent-death",
      "urn:tag:keyword:media:death_of_parent",
      "urn:tag:keyword:media:death_of_parents",
      "urn:tag:keyword:media:death_of_mother",
      "urn:tag:keyword:media:death_of_father",
      "urn:tag:archetype:qloo:the_dying_parent",
      "urn:tag:theme:qloo:parental_grief",
    ],
    tagPrefixes: [
      "urn:tag:keyword:media:death_of_parent_",
      "urn:tag:keyword:media:death_of_parents_",
      "urn:tag:keyword:media:death_of_mother_",
      "urn:tag:keyword:media:death_of_father_",
      "urn:tag:archetype:qloo:the_dying_parent_",
      "urn:tag:theme:qloo:parental_grief_",
    ],
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
    tagIds: [
      "urn:tag:sample:grief",
      "urn:tag:theme:qloo:grief",
      "urn:tag:keyword:media:grief",
      "urn:tag:keyword:media:death",
      "urn:tag:theme:qloo:death_and_remembrance",
    ],
    tagPrefixes: [
      "urn:tag:theme:qloo:grief_",
      "urn:tag:keyword:media:grief_",
      "urn:tag:keyword:media:death_of_",
    ],
    tagNames: ["grief", "mourning"],
    keywords: ["grief", "mourning", "funeral", "duelo", "luto"],
  },
];

export function themeRuleById(id: string): ThemeRule | undefined {
  return themeRules.find((rule) => rule.id === id);
}

/** Exact identifiers win, then the most specific namespace-bound family. */
export function themeRuleForTag(tagId: string): ThemeRule | undefined {
  const exact = themeRules.find((rule) => rule.tagIds.includes(tagId));
  if (exact) return exact;
  return themeRules
    .flatMap((rule) => rule.tagPrefixes.map((prefix) => ({ rule, prefix })))
    .filter(({ prefix }) => tagId.startsWith(prefix) && tagId.length > prefix.length)
    .sort((a, b) => b.prefix.length - a.prefix.length)[0]?.rule;
}
