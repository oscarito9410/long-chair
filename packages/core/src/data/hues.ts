export const hues = ["apricot", "seaglass", "honey", "wisteria"] as const;

export type Hue = (typeof hues)[number];
