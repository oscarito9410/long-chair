export const iconNames = [
  "film",
  "screen",
  "headphones",
  "book",
  "note",
  "clock",
  "aside",
  "pin",
  "chat",
  "check",
  "arrow",
  "stack",
  "split",
  "bread",
  "bowl",
  "cup",
  "chair",
  "pause",
  "x",
  "gear",
] as const;

export type IconName = (typeof iconNames)[number];
