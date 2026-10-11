import { useEffect, useRef } from "react";
import { motion, type DotMode } from "../../tokens/tokens.ts";
import {
  createDots,
  dotsSettled,
  drawDots,
  readHueColors,
  stepDots,
  type Dot,
} from "./dot-model.ts";

const motionQuery = "(prefers-reduced-motion: reduce)";

export function DotField({ mode }: { mode: DotMode }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modeRef = useRef(mode);
  const startRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    modeRef.current = mode;
    startRef.current();
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const reducedQuery = window.matchMedia(motionQuery);
    let reduced = reducedQuery.matches;
    let dots: Dot[] = [];
    let colors = readHueColors();
    let width = 0;
    let height = 0;
    let frame = 0;
    let looping = false;
    let time = 0;
    let last = performance.now();
    const pointer = { x: 0, y: 0, active: false };

    const paint = () => {
      drawDots(context, dots, colors, width, height);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, motion.maxDevicePixelRatio);
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      colors = readHueColors();
      dots = createDots(width, height);
      paint();
    };

    const frameStep = (now: number) => {
      const delta = Math.min(motion.maxFrameSeconds, (now - last) / 1000);
      last = now;
      time += delta;
      stepDots({
        dots,
        width,
        height,
        pointerX: pointer.x,
        pointerY: pointer.y,
        pointerActive: pointer.active,
        mode: modeRef.current,
        reduced,
        time,
      });
      paint();
      if (!reduced && !document.hidden && !dotsSettled(dots, modeRef.current, pointer.active)) {
        frame = window.requestAnimationFrame(frameStep);
        looping = true;
        return;
      }
      looping = false;
    };

    const start = () => {
      if (reduced || document.hidden || looping) {
        return;
      }
      if (
        modeRef.current !== "gather" &&
        !pointer.active &&
        dotsSettled(dots, modeRef.current, pointer.active)
      ) {
        return;
      }
      last = performance.now();
      looping = true;
      frame = window.requestAnimationFrame(frameStep);
    };

    startRef.current = start;

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
      start();
    };

    const onPointerEnd = () => {
      pointer.active = false;
      start();
    };

    const onVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        looping = false;
        return;
      }
      start();
    };

    const onMotionChange = () => {
      reduced = reducedQuery.matches;
      window.cancelAnimationFrame(frame);
      looping = false;
      stepDots({
        dots,
        width,
        height,
        pointerX: pointer.x,
        pointerY: pointer.y,
        pointerActive: false,
        mode: reduced ? "ambient" : modeRef.current,
        reduced,
        time,
      });
      paint();
      start();
    };

    resize();
    if (!reduced && modeRef.current === "gather") {
      start();
    }

    const observer = new ResizeObserver(() => {
      resize();
      start();
    });
    observer.observe(canvas);

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("pointerup", onPointerEnd);
    window.addEventListener("pointercancel", onPointerEnd);
    window.addEventListener("blur", onPointerEnd);
    document.addEventListener("visibilitychange", onVisibility);
    reducedQuery.addEventListener("change", onMotionChange);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("pointerup", onPointerEnd);
      window.removeEventListener("pointercancel", onPointerEnd);
      window.removeEventListener("blur", onPointerEnd);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", onMotionChange);
      startRef.current = () => undefined;
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" aria-hidden="true" />
  );
}
