/** A common in-center hemodialysis chair, used as the sample default. */
export const TYPICAL_CHAIR_MINUTES = 240;

export const durationChoices = [
  { minutes: 60, label: "1 hour", detail: "A shorter visit" },
  { minutes: 120, label: "2 hours", detail: "A few episodes, or a long talk" },
  { minutes: 180, label: "3 hours", detail: "Room for a longer arc" },
  {
    minutes: TYPICAL_CHAIR_MINUTES,
    label: "4 hours",
    detail: "A typical dialysis chair",
  },
] as const;
