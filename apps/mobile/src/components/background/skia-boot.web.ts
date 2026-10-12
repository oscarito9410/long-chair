import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web/LoadSkiaWeb";

const BOOT_MS = 4000;
const WASM_FILE = "canvaskit.wasm";

function wasmUrl(file: string): string {
  if (typeof window === "undefined") {
    return `/${file}`;
  }
  return new URL(file, window.location.origin).toString();
}

function withTimeout(work: Promise<unknown>): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("skia boot timed out"));
    }, BOOT_MS);
    work.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error("skia boot failed"));
      },
    );
  });
}

function isSkiaFailure(reason: unknown): boolean {
  const message = reason instanceof Error ? reason.message : String(reason);
  return (
    message.includes("Aborted") || message.includes("WebAssembly") || message.includes("canvaskit")
  );
}

/**
 * Load CanvasKit from /canvaskit.wasm in the Expo public folder.
 * A missing or HTML response must not become a redbox; the studio falls back.
 */
export async function bootSkia(): Promise<boolean> {
  const onRejection = (event: PromiseRejectionEvent) => {
    if (isSkiaFailure(event.reason)) {
      event.preventDefault();
    }
  };
  const onError = (event: ErrorEvent) => {
    if (isSkiaFailure(event.error ?? event.message)) {
      event.preventDefault();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("error", onError);
  }
  try {
    await withTimeout(
      LoadSkiaWeb({
        locateFile: (file: string) => wasmUrl(file === WASM_FILE ? WASM_FILE : file),
      }),
    );
    const host = globalThis as { CanvasKit?: unknown };
    return host.CanvasKit != null;
  } catch {
    return false;
  } finally {
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        window.removeEventListener("unhandledrejection", onRejection);
        window.removeEventListener("error", onError);
      }, BOOT_MS);
    }
  }
}
