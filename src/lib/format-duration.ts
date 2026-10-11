export function formatHoursMinutes(total: number): string {
  const safe = Math.max(0, Math.round(total));
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;
  if (hours === 0) {
    return `${minutes}m`;
  }
  const padded = minutes.toString().padStart(2, "0");
  return `${hours}h ${padded}m`;
}

export function formatRange(start: number, end: number): string {
  return `${formatClock(start)}\u2013${formatClock(end)}`;
}

export function formatClock(total: number): string {
  const safe = Math.max(0, Math.round(total));
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;
  const padded = minutes.toString().padStart(2, "0");
  return `${hours}:${padded}`;
}
