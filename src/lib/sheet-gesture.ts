const SHEET_DISMISS_PX = 64;

export function sheetShouldDismiss(deltaY: number): boolean {
  return deltaY >= SHEET_DISMISS_PX;
}
