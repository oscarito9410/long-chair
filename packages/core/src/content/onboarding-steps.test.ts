import { describe, expect, it } from "vitest";

import { ONBOARDING_DOT_COUNT, onboardingStepIndex } from "./onboarding-steps.ts";

describe("onboarding steps", () => {
  it("counts the four steps after welcome and tastes", () => {
    expect(ONBOARDING_DOT_COUNT).toBe(4);
    expect(onboardingStepIndex.chair).toBe(1);
    expect(onboardingStepIndex.themes).toBe(2);
    expect(onboardingStepIndex.company).toBe(3);
    expect(onboardingStepIndex.building).toBe(4);
  });
});
