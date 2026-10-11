export const COLUMN_COUNT = 2;
export const TILE_ASPECT = 1.1;

export function columnWidth(screenWidth: number, padding: number, gap: number): number {
  const columns = COLUMN_COUNT;
  return (screenWidth - padding * 2 - gap * (columns - 1)) / columns;
}
