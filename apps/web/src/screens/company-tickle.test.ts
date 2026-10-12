/** @vitest-environment jsdom */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { readFileSync } from "node:fs";
import { SessionProvider } from "../state/SessionContext.tsx";
import { CompanyScreen } from "./CompanyScreen.tsx";

const styles = readFileSync("src/index.css", "utf8");
const hiddenRule = styles.match(/\.visually-hidden\s*\{[^}]+\}/)?.[0];
const focusRule = styles.match(/:focus-visible\s*\{[^}]+\}/)?.[0];

describe("Company tickle control", () => {
  let root: Root | undefined;
  let host: HTMLDivElement;
  let style: HTMLStyleElement;

  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", {
      configurable: true,
      value: true,
    });
    expect(hiddenRule).toBeDefined();
    expect(focusRule).toBeDefined();
    style = document.createElement("style");
    style.textContent = `${hiddenRule ?? ""}\n${focusRule ?? ""}`;
    document.head.appendChild(style);
    host = document.createElement("div");
    document.body.appendChild(host);
    const screenRoot = createRoot(host);
    root = screenRoot;
    act(() => {
      screenRoot.render(createElement(SessionProvider, null, createElement(CompanyScreen)));
    });
  });

  afterEach(() => {
    act(() => {
      root?.unmount();
    });
    host.remove();
    style.remove();
    vi.useRealTimers();
    Reflect.deleteProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT");
  });

  it("offers an unclipped native button with the shared target and focus styling", () => {
    const button = [...host.querySelectorAll("button")].find(
      (candidate) => candidate.textContent === "Tickle",
    );
    expect(button).toBeDefined();
    if (!button) throw new Error("Tickle control was not rendered.");
    button.focus();
    expect(document.activeElement).toBe(button);
    expect(button.tabIndex).toBe(0);
    expect(button.classList.contains("visually-hidden")).toBe(false);
    expect(getComputedStyle(button).clip).not.toContain("rect(");
    expect(getComputedStyle(button).width).not.toBe("1px");
    expect(getComputedStyle(button).height).not.toBe("1px");
    expect(button.classList.contains("min-h-[var(--lc-target)]")).toBe(true);
    expect(focusRule).toContain("outline: var(--lc-focus-width) solid var(--lc-ink)");
  });

  it("tickles the selected guide when the native button is activated", () => {
    const button = [...host.querySelectorAll("button")].find(
      (candidate) => candidate.textContent === "Tickle",
    );
    if (!button) throw new Error("Tickle control was not rendered.");
    button.focus();
    act(() => {
      button.click();
    });
    expect(document.activeElement).toBe(button);
    expect(host.querySelectorAll(".character-tickle")).toHaveLength(1);
    expect(host.querySelector(".guide-pick.is-selected .character-tickle")).not.toBeNull();
  });
});
