import { router } from "expo-router";

import { itemPath } from "./safe-route";

type SheetHref = "/settings" | `/item/${string}`;

export function openSettings(): void {
  present("/settings");
}

export function openItem(id: string): void {
  const path = itemPath(id);
  if (!path) {
    return;
  }
  present(path);
}

export function closeSheet(): void {
  if (dismissSheet() || goBackIfPossible()) {
    return;
  }
  router.replace("/(tabs)/kit");
}

export function showKit(): void {
  try {
    router.dismissTo("/(tabs)/kit");
  } catch {
    router.replace("/(tabs)/kit");
  }
}

function present(href: SheetHref): void {
  try {
    router.push(href);
  } catch {
    // NativeTabs can reject a sheet push while its own transition is in flight.
    router.navigate(href);
  }
}

function dismissSheet(): boolean {
  try {
    if (!router.canDismiss()) {
      return false;
    }
    router.dismiss();
    return true;
  } catch {
    return false;
  }
}

function goBackIfPossible(): boolean {
  try {
    if (!router.canGoBack()) {
      return false;
    }
    router.back();
    return true;
  } catch {
    return false;
  }
}
