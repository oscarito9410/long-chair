export { avoidThemes, clearedThemes } from "./data/avoid-themes.ts";
export { catalog, itemById } from "./data/catalog.ts";
export type {
  AgentStep,
  AvoidTheme,
  CatalogItem,
  CompanionTopic,
  ContentKind,
  NearbyPlace,
  PackedSession,
  PackedSlot,
  PlaceKind,
  SessionDraft,
  TasteSeed,
} from "./data/types.ts";
export { contentKinds, placeKinds } from "./data/types.ts";
export { characterAccessories, characterMoods, characterShapes } from "./data/character-kinds.ts";
export type {
  CharacterAccessory,
  CharacterMood,
  CharacterShape,
  CharacterVariant,
} from "./data/character-kinds.ts";
export { companionSetting, companionTopics, nearbyPlaces, topicsForSeeds } from "./data/companion.ts";
export { FALLBACK_COMPARE_ID, plainModelExample } from "./data/comparison.ts";
export { demoDraft, openingDraft } from "./data/demo-profile.ts";
export { TYPICAL_CHAIR_MINUTES, durationChoices } from "./data/durations.ts";
export { guideById, guides } from "./data/guides.ts";
export type { Guide } from "./data/guides.ts";
export { hues } from "./data/hues.ts";
export type { Hue } from "./data/hues.ts";
export { motion, palette, radius, space, stickerTilt, typeScale } from "./theme/tokens.ts";
export { tasteSeeds } from "./data/taste-seeds.ts";
export {
  TASTE_MAX,
  TASTE_MIN,
  TASTE_SEARCH_DEBOUNCE_MS,
  canContinueTastes,
  foldTasteText,
  quickStartTastes,
  searchTasteCatalog,
  tasteById,
  tasteCatalog,
  tasteKindIcons,
  tasteKinds,
  tastePickLabel,
  tasteSearchPlaceholder,
  toggleTaste,
  welcomeNotesAt,
  welcomeTasteExamples,
} from "./data/taste-catalog.ts";
export type { TasteEntity, TasteIcon, TasteKind } from "./data/taste-catalog.ts";
export { kindLabels, placeLabels } from "./content/kind-labels.ts";
export { ONBOARDING_DOT_COUNT, onboardingStepIndex } from "./content/onboarding-steps.ts";
export {
  buildingReadyLabel,
  buildingSkipLabel,
  itemThemeCheck,
  loveLede,
  notMedicalAdvice,
  sampleShelfNote,
  themesLede,
  themesNote,
} from "./content/screen-copy.ts";
export { buildAgentSteps } from "./lib/build-agent-steps.ts";
export { compareBroughtLabels } from "./lib/compare-brought.ts";
export { formatClock, formatHoursMinutes, formatRange } from "./lib/format-duration.ts";
export { guideHeader, guideLead } from "./lib/guide-header.ts";
export { kitStampLine } from "./lib/kit-stamp.ts";
export {
  avoidedLabels,
  exceptionLabels,
  matchingSeedNames,
  plainThemeLabels,
} from "./lib/match-taste.ts";
export { PAUSE_NOTICE_MINUTES, QUIET_FILL_RATIO, packSession } from "./lib/pack-session.ts";
export { buildingLiveText, stepState } from "./lib/step-state.ts";
export type { StepState } from "./lib/step-state.ts";
export { toggleId } from "./lib/toggle-id.ts";
export {
  createFixtureKitService,
  createHttpKitService,
  createKitService,
} from "./service/kit-service.ts";
export type { FetchLike, KitService, PlanSource, SessionPlan } from "./service/kit-service.ts";
export {
  createFixtureTasteSearch,
  createHttpTasteSearch,
  createTasteSearch,
} from "./service/taste-search.ts";
export type { TasteSearchPort, TasteSearchResult } from "./service/taste-search.ts";
