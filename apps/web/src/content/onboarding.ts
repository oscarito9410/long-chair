import { ONBOARDING_DOT_COUNT, onboardingStepIndex } from "@long-chair/core";
import { paths } from "../routing/paths.ts";

export { ONBOARDING_DOT_COUNT };

export const onboardingProgress = {
  chair: { step: onboardingStepIndex.chair, backHref: paths.love },
  themes: { step: onboardingStepIndex.themes, backHref: paths.chair },
  company: { step: onboardingStepIndex.company, backHref: paths.themes },
  building: { step: onboardingStepIndex.building, backHref: paths.company },
} as const;
