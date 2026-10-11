import { useCallback, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { sheetShouldDismiss } from "../../lib/sheet-gesture.ts";
import { GlassSurface } from "../glass/GlassSurface.tsx";
import { Icon } from "../ui/Icon.tsx";
import { useAppWindow } from "./AppShell.tsx";
import { useSheetFocus } from "./use-sheet-a11y.ts";

export function BottomSheet({
  onClose,
  labelledBy,
  label,
  children,
}: {
  onClose: () => void;
  labelledBy?: string;
  label?: string;
  children: ReactNode;
}) {
  const startY = useRef<number | null>(null);
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);
  const mount = useAppWindow();
  useSheetFocus(panel, onClose);

  const onPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }
    startY.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (startY.current === null) {
        return;
      }
      const delta = event.clientY - startY.current;
      startY.current = null;
      if (sheetShouldDismiss(delta)) {
        onClose();
      }
    },
    [onClose],
  );

  if (!mount) {
    return null;
  }

  return createPortal(
    <div
      ref={setPanel}
      className="sheet-root"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : label}
    >
      <button type="button" className="sheet-scrim" aria-label="Close piece" onClick={onClose} />
      <div className="sheet-panel" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <GlassSurface variant="sheet" thickness="thick" className="sheet-card">
          <div className="sheet-top">
            <div className="sheet-handle" aria-hidden="true" />
            <button
              type="button"
              className="sheet-close"
              data-sheet-close
              aria-label="Close"
              onClick={onClose}
            >
              <Icon name="x" />
            </button>
          </div>
          {children}
        </GlassSurface>
      </div>
    </div>,
    mount,
  );
}
