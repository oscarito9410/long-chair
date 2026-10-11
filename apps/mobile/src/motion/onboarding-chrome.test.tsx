/** @vitest-environment jsdom */
import { act, createElement, Profiler, type ProfilerOnRenderCallback } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import {
  OnboardingChromeProvider,
  useOnboardingChrome,
  useOnboardingStore,
} from "./onboarding-chrome";

const RENDER_CAP = 8;

let commits = 0;

const countCommit: ProfilerOnRenderCallback = () => {
  commits += 1;
};

function ThemesStep({ primary }: { primary: string }) {
  useOnboardingChrome({
    primary,
    linkLabel: "Skip for now",
    footerNote: "Not medical advice",
    onPrimary() {
      return undefined;
    },
    onLink() {
      return undefined;
    },
  });
  const { store } = useOnboardingStore();
  return createElement("span", null, store.primary);
}

function Frame({ primary }: { primary: string }) {
  return createElement(
    Profiler,
    { id: "onboarding", onRender: countCommit },
    createElement(OnboardingChromeProvider, null, createElement(ThemesStep, { primary })),
  );
}

describe("useOnboardingChrome", () => {
  let root: Root | undefined;

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    commits = 0;
  });

  it("settles when a screen passes fresh inline callbacks", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);

    act(() => {
      root?.render(createElement(Frame, { primary: "Continue" }));
    });
    expect(commits).toBeGreaterThan(0);
    expect(commits).toBeLessThanOrEqual(RENDER_CAP);
    expect(host.textContent).toBe("Continue");
    const afterMount = commits;

    act(() => {
      root?.render(createElement(Frame, { primary: "Continue" }));
    });
    expect(commits).toBeLessThanOrEqual(afterMount + 2);
    expect(host.textContent).toBe("Continue");

    act(() => {
      root?.render(createElement(Frame, { primary: "Your kit is ready" }));
    });
    expect(host.textContent).toBe("Your kit is ready");
    expect(commits).toBeLessThanOrEqual(RENDER_CAP);
  });
});
