/**
 * The plain-model miss uses a real, well-known title only as an example of
 * the failure mode. It is not part of the Long Chair shelf, and no text from
 * the work is reproduced. Every Long Chair title elsewhere is fictional.
 */
export const plainModelExample = {
  title: "The Fault in Our Stars",
  meta: "A famous novel, later a film",
  summary:
    "Asked for comfort during treatment, a general model often reaches for a well-known story about teenagers living with cancer.",
  themeIds: ["cancer", "hospitals", "illness", "grief", "parent-death"],
} as const;

export const FALLBACK_COMPARE_ID = "north-window";
