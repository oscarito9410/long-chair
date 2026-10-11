import type { CompanionTopic, NearbyPlace } from "./types.ts";

export const companionSetting = {
  placeName: "Westbridge Infusion Center",
  when: "this afternoon",
  disclaimer:
    "These places are fictional. They are drawn near a fictional center and shown as open for the sample afternoon.",
} as const;

export const companionTopics: readonly CompanionTopic[] = [
  {
    id: "greenhouse",
    seedId: "paper-kite",
    title: "The repair, continued",
    prompt:
      "The Paper Kite is a slow repair. If you had a week and a cracked pane, where would you start?",
  },
  {
    id: "buoy",
    seedId: "harbor-lights",
    title: "Who moved the blue buoy?",
    prompt:
      "The night desk follows one quiet clue. You can trade guesses without spoiling the ending for each other.",
  },
  {
    id: "bread",
    seedId: "slow-kitchen",
    title: "Bread on a Tuesday",
    prompt:
      "The episode is one loaf and a long rise. Ask what you would bake if the afternoon had an oven.",
  },
  {
    id: "cedar",
    seedId: "mira-solano",
    title: "The song for the ride home",
    prompt:
      "Cedar Hall is a small room and a warm voice. Pick one track to replay in the car, and say why.",
  },
  {
    id: "morning",
    seedId: "salt-windowlight",
    title: "A kitchen before anyone talks",
    prompt:
      "Market Morning is about light on a counter. Describe the first room you want to walk into after this.",
  },
  {
    id: "trains",
    seedId: "sunday-engines",
    title: "The smallest train",
    prompt:
      "Sunday Engines loves short lines and open windows. What is the smallest train either of you has ridden?",
  },
];

export const nearbyPlaces: readonly NearbyPlace[] = [
  {
    id: "linen-rye",
    kind: "bakery",
    name: "Linen & Rye",
    offer: "Soup, brown bread, and a quiet corner",
    walkMinutes: 6,
    openUntil: "4:30 pm",
    priceLabel: "Light bill",
  },
  {
    id: "cedar-spoon",
    kind: "kitchen",
    name: "Cedar Spoon",
    offer: "Broth and rice, and the room stays low",
    walkMinutes: 9,
    openUntil: "6:00 pm",
    priceLabel: "Light bill",
  },
  {
    id: "little-harbor",
    kind: "coffee",
    name: "Little Harbor Coffee",
    offer: "Tea, and something small if that is enough",
    walkMinutes: 4,
    openUntil: "5:00 pm",
    priceLabel: "Light bill",
  },
];
