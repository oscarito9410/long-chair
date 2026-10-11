import { paths } from "../routing/paths.ts";

export const ONBOARDING_DOT_COUNT = 4;

export const onboardingProgress = {
  chair: { step: 1, backHref: paths.love },
  themes: { step: 2, backHref: paths.chair },
  company: { step: 3, backHref: paths.themes },
  building: { step: 4, backHref: paths.company },
} as const;
