import type { NamedTag, Verdict } from "./theme-signals.ts";
import type { BuiltInThemeId } from "./theme-rules.ts";
import { builtInThemeIds } from "./theme-rules.ts";

/**
 * Hand-labeled sample titles for the theme check.
 * These are not live Qloo, TMDB, or Does the Dog Die records.
 */
export type GoldenTitle = {
  id: string;
  title: string;
  synopsis: string;
  qlooTags: readonly NamedTag[];
  tmdbKeywords: readonly string[];
  contentWarnings: readonly string[];
  expected: Record<BuiltInThemeId, Verdict>;
  sample: boolean;
};

const clearSynopsis = [
  "Friends share a garden and stay for soup.",
  "A mapmaker names three apple lanes and walks home.",
  "Two neighbors repair a radio and listen to the weather.",
  "A baker opens early and saves the last roll.",
  "Children fold paper boats under a footbridge.",
  "A band rehearses four songs in a small hall.",
  "A ferry captain learns a shorter route along the coast.",
  "Players stay after practice to argue about the line.",
  "A cook writes a one-pan supper for a Tuesday.",
  "Travelers count trains from a quiet platform bench.",
  "A librarian reads the afternoon story and closes the shutters.",
  "Neighbors paint a mural and leave the brushes in a bucket.",
  "A cyclist rides the long way around the park.",
  "Siblings set a table for a birthday with no speeches.",
  "A potter finishes one bowl and starts the next.",
  "The night market sells oranges and folded newspapers.",
  "A choir practices the chorus and then has tea.",
  "A carpenter measures a window twice.",
  "Friends watch the river and name the birds they know.",
  "A teacher pins a map and asks who has been there.",
];

function blankExpected(
  overrides: Partial<Record<BuiltInThemeId, Verdict>> = {},
): Record<BuiltInThemeId, Verdict> {
  const expected = {
    illness: "clear",
    hospitals: "clear",
    cancer: "clear",
    "parent-death": "clear",
    grief: "clear",
  } as Record<BuiltInThemeId, Verdict>;
  for (const id of builtInThemeIds) {
    const override = overrides[id];
    if (override) {
      expected[id] = override;
    }
  }
  return expected;
}

function tagged(id: string, name: string): NamedTag {
  return { id, name };
}

const flagged: GoldenTitle[] = [
  title(
    "g-ill-1",
    "Sample illness one",
    "The plot turns on a long illness.",
    {},
    { illness: "flagged" },
  ),
  title(
    "g-ill-2",
    "Sample illness two",
    "She is sick and the day is rearranged.",
    {},
    { illness: "flagged" },
  ),
  title(
    "g-ill-3",
    "Sample illness three",
    "A disease changes the household routine.",
    {},
    { illness: "flagged" },
  ),
  title(
    "g-ill-4",
    "Sample illness four",
    "The diagnosis arrives by letter.",
    {},
    { illness: "flagged" },
  ),
  title(
    "g-ill-5",
    "Sample illness five",
    "La enfermedad ocupa la cocina.",
    {},
    { illness: "flagged" },
  ),
  title(
    "g-ill-6",
    "Sample illness six",
    "El enfermo espera en el patio.",
    {},
    { illness: "flagged" },
  ),
  title(
    "g-ill-7",
    "Sample illness seven",
    "A quiet afternoon in a garden.",
    { qlooTags: [tagged("urn:tag:sample:illness", "medical drama")] },
    { illness: "flagged" },
  ),
  title(
    "g-ill-8",
    "Sample illness eight",
    "Neighbors bring soup.",
    { tmdbKeywords: ["illness"] },
    { illness: "flagged" },
  ),
  title(
    "g-hos-1",
    "Sample hospital one",
    "The story stays inside a hospital.",
    {},
    { hospitals: "flagged" },
  ),
  title(
    "g-hos-2",
    "Sample hospital two",
    "A ward at night, and a window.",
    {},
    { hospitals: "flagged" },
  ),
  title(
    "g-hos-3",
    "Sample hospital three",
    "They meet in a clinic hallway.",
    {},
    { hospitals: "flagged" },
  ),
  title(
    "g-hos-4",
    "Sample hospital four",
    "La clinica cierra tarde.",
    {},
    { hospitals: "flagged" },
  ),
  title(
    "g-hos-5",
    "Sample hospital five",
    "La sala de espera tiene una planta.",
    {},
    { hospitals: "flagged" },
  ),
  title(
    "g-hos-6",
    "Sample hospital six",
    "A short walk home.",
    { contentWarnings: ["hospital"] },
    { hospitals: "flagged" },
  ),
  title(
    "g-can-1",
    "Sample cancer one",
    "Cancer is the plot of the season.",
    {},
    { cancer: "flagged" },
  ),
  title(
    "g-can-2",
    "Sample cancer two",
    "Chemotherapy sets the calendar.",
    {},
    { cancer: "flagged" },
  ),
  title(
    "g-can-3",
    "Sample cancer three",
    "A tumor scare organizes the week.",
    {},
    { cancer: "flagged" },
  ),
  title(
    "g-can-4",
    "Sample cancer four",
    "The oncologist is a main character.",
    {},
    { cancer: "flagged" },
  ),
  title(
    "g-can-5",
    "Sample cancer five",
    "La quimioterapia es el centro del capitulo.",
    {},
    { cancer: "flagged" },
  ),
  title(
    "g-can-6",
    "Sample cancer six",
    "Friends cook and talk.",
    { qlooTags: [tagged("urn:tag:sample:cancer", "cancer")] },
    { cancer: "flagged" },
  ),
  title(
    "g-par-1",
    "Sample parent one",
    "Her mother died before the trip.",
    {},
    { "parent-death": "flagged" },
  ),
  title(
    "g-par-2",
    "Sample parent two",
    "His father died in the first chapter.",
    {},
    { "parent-death": "flagged" },
  ),
  title(
    "g-par-3",
    "Sample parent three",
    "She lost her mother and kept the letters.",
    {},
    { "parent-death": "flagged" },
  ),
  title(
    "g-par-4",
    "Sample parent four",
    "He lost his father and the workshop.",
    {},
    { "parent-death": "flagged" },
  ),
  title(
    "g-par-5",
    "Sample parent five",
    "La muerte de la madre abre el relato.",
    {},
    { "parent-death": "flagged" },
  ),
  title(
    "g-par-6",
    "Sample parent six",
    "Un viaje largo.",
    { tmdbKeywords: ["muerte del padre"] },
    { "parent-death": "flagged" },
  ),
  title(
    "g-gri-1",
    "Sample grief one",
    "Grief is the thread of the hour.",
    {},
    { grief: "flagged" },
  ),
  title("g-gri-2", "Sample grief two", "Mourning fills the house.", {}, { grief: "flagged" }),
  title("g-gri-3", "Sample grief three", "El duelo dura todo el verano.", {}, { grief: "flagged" }),
  title("g-gri-4", "Sample grief four", "El luto cambia la mesa.", {}, { grief: "flagged" }),
  title(
    "g-gri-fn",
    "Sample grief miss",
    "A sad goodbye on a station platform.",
    {},
    { grief: "flagged" },
  ),
  title(
    "g-gri-fp",
    "Sample ferry rite",
    "The town holds a funeral for a retired ferry.",
    {},
    { grief: "clear" },
  ),
];

function title(
  id: string,
  name: string,
  synopsis: string,
  signals: {
    qlooTags?: readonly NamedTag[];
    tmdbKeywords?: readonly string[];
    contentWarnings?: readonly string[];
  },
  expected: Partial<Record<BuiltInThemeId, Verdict>>,
): GoldenTitle {
  return {
    id,
    title: name,
    synopsis,
    qlooTags: signals.qlooTags ?? [],
    tmdbKeywords: signals.tmdbKeywords ?? [],
    contentWarnings: signals.contentWarnings ?? [],
    expected: blankExpected(expected),
    sample: true,
  };
}

const CLEAR_COUNT = 18;

const clearTitles: GoldenTitle[] = clearSynopsis
  .slice(0, CLEAR_COUNT)
  .map((synopsis, index) =>
    title(`g-clear-${index + 1}`, `Sample clear ${index + 1}`, synopsis, {}, {}),
  );

export const goldenTitles: readonly GoldenTitle[] = [...flagged, ...clearTitles];
