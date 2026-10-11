export const DIAL_MIN = 60;
export const DIAL_MAX = 240;
export const DIAL_TICK = 15;
export const DIAL_SWEEP = 270;
export const DIAL_START = 135;
export const DIAL_TURN = 360;

export function snapMinutes(value: number): number {
  "worklet";
  const clamped = Math.min(DIAL_MAX, Math.max(DIAL_MIN, value));
  const steps = Math.round((clamped - DIAL_MIN) / DIAL_TICK);
  return DIAL_MIN + steps * DIAL_TICK;
}

export function minutesFromPoint(x: number, y: number, cx: number, cy: number): number {
  "worklet";
  const radians = Math.atan2(y - cy, x - cx);
  let degrees = (radians * 180) / Math.PI;
  if (degrees < 0) {
    degrees += DIAL_TURN;
  }
  let fromStart = degrees - DIAL_START;
  if (fromStart < 0) {
    fromStart += DIAL_TURN;
  }
  if (fromStart > DIAL_SWEEP) {
    const pastEnd = fromStart - DIAL_SWEEP;
    const beforeStart = DIAL_TURN - fromStart;
    fromStart = pastEnd < beforeStart ? DIAL_SWEEP : 0;
  }
  const minutes = (fromStart / DIAL_SWEEP) * DIAL_MAX;
  return snapMinutes(minutes);
}

export function hourFigure(minutes: number): string {
  const hours = minutes / DIAL_MIN;
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
}
