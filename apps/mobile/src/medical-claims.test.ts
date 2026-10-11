import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { findClaimPhrases } from "./medical-claims";

const appRoot = join(import.meta.dirname, "..");

function collect(dir: string, found: string[]): void {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (name === "node_modules" || name === "dist" || name === ".expo") {
      continue;
    }
    const info = statSync(path);
    if (info.isDirectory()) {
      collect(path, found);
      continue;
    }
    if (name.endsWith(".test.ts")) {
      continue;
    }
    if (name === "medical-claims.ts") {
      continue;
    }
    if (name.endsWith(".ts") || name.endsWith(".tsx") || name.endsWith(".json")) {
      found.push(path);
    }
  }
}

describe("mobile copy", () => {
  it("rejects medical and therapeutic claims", () => {
    const files: string[] = [];
    collect(appRoot, files);
    const hits = files.flatMap((path) => {
      const phrases = findClaimPhrases(readFileSync(path, "utf8"));
      return phrases.map((phrase) => `${path} contains "${phrase}"`);
    });
    expect(hits).toEqual([]);
  });

  it("keeps the disclaimer on welcome and in settings", () => {
    const welcome = readFileSync(join(appRoot, "app/index.tsx"), "utf8");
    const settings = readFileSync(join(appRoot, "app/settings.tsx"), "utf8");
    expect(welcome).toContain("notMedicalAdvice");
    expect(settings).toContain("notMedicalAdvice");
    expect(welcome).toContain("sampleShelfNote");
    expect(settings).toContain("sampleShelfNote");
  });

  it("ships as Long Chair with no health entitlement and no collected data", () => {
    const app = JSON.parse(readFileSync(join(appRoot, "app.json"), "utf8")) as {
      expo: {
        name: string;
        ios: {
          bundleIdentifier: string;
          infoPlist: { ITSAppUsesNonExemptEncryption: boolean };
          privacyManifests: { NSPrivacyCollectedDataTypes: unknown[] };
        };
      };
    };
    expect(app.expo.name).toBe("Long Chair");
    expect(app.expo.ios.bundleIdentifier).toBe("com.oscarito9410.longchair");
    expect(app.expo.ios.infoPlist.ITSAppUsesNonExemptEncryption).toBe(false);
    expect(app.expo.ios.privacyManifests.NSPrivacyCollectedDataTypes).toEqual([]);
    expect(JSON.stringify(app).toLowerCase()).not.toContain("healthkit");

    const eas = JSON.parse(readFileSync(join(appRoot, "eas.json"), "utf8")) as {
      build: Record<string, { ios?: { autoIncrement?: boolean } }>;
    };
    expect(eas.build.development?.ios?.autoIncrement).toBe(true);
    expect(eas.build.preview?.ios?.autoIncrement).toBe(true);
    expect(eas.build.production?.ios?.autoIncrement).toBe(true);
  });
});
