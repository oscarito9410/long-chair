import { formatHoursMinutes } from "./format-duration.ts";

const stampSeparator = "\u00b7";

export function kitStampLine(pieces: number, minutes: number): string {
  const label = pieces === 1 ? "piece" : "pieces";
  return `${pieces} ${label} ${stampSeparator} ${formatHoursMinutes(minutes)}`;
}
