import { describe, expect, it } from "vitest";

import { paths } from "../routing/paths.ts";
import { ONBOARDING_DOT_COUNT, onboardingProgress } from "./onboarding.ts";

describe("onboardingProgress", () => {
  it("gives chair, themes, company, and building four dots and a back link", () => {
    expect(ONBOARDING_DOT_COUNT).toBe(4);
    expect(onboardingProgress.chair).toEqual({ step: 1, backHref: paths.love });
    expect(onboardingProgress.themes).toEqual({ step: 2, backHref: paths.chair });
    expect(onboardingProgress.company).toEqual({ step: 3, backHref: paths.themes });
    expect(onboardingProgress.building).toEqual({ step: 4, backHref: paths.company });
  });
});
