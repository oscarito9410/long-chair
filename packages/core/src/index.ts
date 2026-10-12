export { avoidThemes } from "./data/avoid-themes.ts";
export { catalog, itemById } from "./data/catalog.ts";
export type {
  AgentStep,
  AvoidTheme,
  CatalogItem,
  DurationSource,
  ItemLink,
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
export {
  characterBody,
  characterEyeY,
  characterEyes,
  characterTone,
  eyeArcPath,
  eyeHighlight,
} from "./data/character-art.ts";
export type { CharacterTone, EyeMark } from "./data/character-art.ts";
export {
  blushFill,
  characterMoments,
  expressionFace,
  expressionForMoment,
  expressionForMood,
  expressionIntroduces,
  expressionPose,
  expressions,
  faceArcPath,
  idleTickle,
  isTickling,
  noteTickleTap,
  POSE_INTRO_MS,
  TICKLE_GIGGLE_MS,
  TICKLE_TAP_COUNT,
  TICKLE_WINDOW_MS,
} from "./data/character-expression.ts";
export type {
  CharacterMoment,
  Expression,
  ExpressionPose,
  FacePiece,
  TickleClock,
} from "./data/character-expression.ts";
export {
  companionSetting,
  companionTopics,
  nearbyPlaces,
  topicsForSeeds,
} from "./data/companion.ts";
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
  commitTypedTaste,
  emptyPickCount,
  foldTasteText,
  quickStartTastes,
  searchTasteCatalog,
  tasteById,
  tasteCatalog,
  tasteContinueLabel,
  tasteDisplayName,
  tasteIdForTyped,
  tasteKindIcons,
  tasteKinds,
  tasteNeedMore,
  tastePickLabel,
  tasteSearchPlaceholder,
  toggleTaste,
  welcomeNotesAt,
  welcomeTasteExamples,
} from "./data/taste-catalog.ts";
export type { TasteEntity, TasteIcon, TasteKind } from "./data/taste-catalog.ts";
export {
  groupForTaste,
  groupMoreCount,
  groupTastes,
  previewGroupTastes,
  tasteGroups,
} from "./data/taste-groups.ts";
export type { TasteGroup, TasteGroupIcon } from "./data/taste-groups.ts";
export { kindLabels, placeLabels } from "./content/kind-labels.ts";
export { ONBOARDING_DOT_COUNT, onboardingStepIndex } from "./content/onboarding-steps.ts";
export {
  addThemeLabel,
  addThemePlaceholder,
  buildingReadyLabel,
  buildingSkipLabel,
  evidenceSampleNote,
  itemThemeCheck,
  loveFooterMeta,
  loveLede,
  notMedicalAdvice,
  justWatchCredit,
  regionMenuLabel,
  sampleWatchNote,
  tmdbCredit,
  sampleKitInstead,
  sampleShelfNote,
  themesLede,
  themesNote,
  whyItPassed,
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
export { evaluateGolden, sampleThemeScoreLine } from "./lib/theme-eval.ts";
export type { ThemeScore, ThemeScorecard } from "./lib/theme-eval.ts";
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
export {
  createFakePopularitySeedProvider,
  createHttpQlooTasteSeedProvider,
  createStaticTasteSeedProvider,
  createTasteSeedProvider,
  groupsFromProviderSeeds,
  rankSeeds,
} from "./service/taste-seed-provider.ts";
export type { PopularityHit, TasteSeedProvider } from "./service/taste-seed-provider.ts";
export {
  admissionFor,
  cautionThemeIdsFor,
  createFixtureKeywordSource,
  createFixtureTagSource,
  createFixtureWarningSource,
  createHttpQlooTagSource,
  createHttpTmdbKeywordSource,
  createHttpWarningSource,
  createThemeVerifier,
  evidenceLines,
  explainItem,
} from "./service/theme-verifier.ts";
export type {
  KeywordSource,
  PackAdmission,
  TagSource,
  ThemeVerifier,
  WarningSource,
} from "./service/theme-verifier.ts";
export {
  groupsForRegion,
  groupsFromSeeds,
  outsideSeedCount,
  regionSeedList,
} from "./data/region-seeds.ts";
export type { RegionSeed, TasteGroupId } from "./data/region-seeds.ts";
export { isRegionCode, regionCodes, regionFromLocale, regionNames } from "./data/regions.ts";
export type { RegionCode } from "./data/regions.ts";
export { addCustomTheme, customThemeFromLabel, customThemesOf } from "./data/theme-signals.ts";
export type { CustomTheme, Evidence, ThemeVerdict, Verdict } from "./data/theme-signals.ts";
