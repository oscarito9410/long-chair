export const welcomeTitle = "What you love, minus what hurts.";

export const welcomeLede = "Company and entertainment, cut to the length of your session.";

export const getStarted = "Get started";

export const seeSample = "See a sample kit";

export const settingsLabel = "Settings";

export const loveTitle = "What do you love?";

export { loveLede } from "@long-chair/core";

export const continueLabel = "Continue";

export const skipLabel = "Skip for now";

export const chooseOne = "Choose one title before you continue.";

export const inTheRoom = "A title is in the room.";

export const selectedInRoom = "In the room";

export const selectedLeftOut = "Left out";

export const chairTitle = "How long is the chair?";

export const chairLede = "Drag the dial. You can change it anytime.";

export const longAfternoon = "A long afternoon";

export const changeAnytime = "You can change this anytime";

export const companyTitle = "Who keeps you company?";

export const buildingTitle = "Building your kit";

export const buildingCaption = "the session we are filling";

export const readyTitle = "Your kit is ready";

export const openKit = "Open my kit";

export const kitTitle = "Your session kit";

export const filledCaption = "filled";

export const editTastes = "Edit tastes";

export const emptyKitTitle = "Nothing fit this session yet";

export const emptyKitAction = "Edit the session";

export const pauseLead = "Still open";

export const nearbyTitle = "Open nearby";

export const talkTitle = "Things to talk about";

export const companionEmpty = "Add a taste to see prompts.";

export const placesNote = "These places are a fictional sample for a quiet afternoon.";

export const compareTitle = "What a plain model misses";

export const compareCaption = "themes held back";

export const wouldBring = "Would bring:";

export const plainStory = "A famous story about cancer.";

export const nothingKept = "Nothing kept yet";

export const addFilm = "Add a film you love.";

export const keptForTaste = "Kept for the taste, not the plot.";

export const missingPiece = "That piece is not on the shelf";

export const backToKit = "Back to the kit";

export const settingsTitle = "Settings";

export const settingsLede = "Company and entertainment for a long session. No account.";

export const onDeviceNote =
  "Tastes and themes you set aside stay on this phone. This build does not send them.";

export const noAccountNote = "Long Chair works without an account. There is nothing to sign in to.";

export const sampleUntilLive = "Sample shelf until a live catalog is connected.";

export const packingSample = "Packing the sample shelf.";

export const planFailed = "The kit could not be planned.";

export const trySampleAgain = "Show the sample again";

export const leftOutLabel = "Left out";

export const nowLabel = "Now";

export const recoveryTitle = "This screen stopped";

export const recoveryBody = "Nothing was sent. Try this screen again, or return to the welcome.";

export const tryAgainLabel = "Try again";

export const backToWelcome = "Back to welcome";

export const backLabel = "Back";

export const closeLabel = "Close";

export const tabs = {
  kit: "Kit",
  companion: "Companion",
  compare: "Compare",
} as const;

export function chooseGuide(name: string): string {
  return `Choose ${name}`;
}

export function becauseYouLove(name: string): string {
  return `Because you love ${name}.`;
}

export function openMinutesLine(label: string): string {
  return `${label} still open in the session.`;
}
