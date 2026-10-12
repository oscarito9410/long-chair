import { guideById, guides, notMedicalAdvice } from "@long-chair/core";
import { router } from "expo-router";
import { useState, type ReactNode } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, { Keyframe } from "react-native-reanimated";

import { CharacterMark } from "../../src/components/art/CharacterMark";
import { Aside } from "../../src/components/chrome/HandNote";
import { WashCard } from "../../src/components/chrome/WashCard";
import { AppIcon } from "../../src/components/chrome/AppIcon";
import { GlassSurface } from "../../src/components/glass/GlassSurface";
import { chooseGuide, skipLabel } from "../../src/copy/phrases";
import { columnWidth, TILE_ASPECT } from "../../src/layout/columns";
import { SpringCheck } from "../../src/motion/SpringCheck";
import { useOnboardingChrome } from "../../src/motion/onboarding-chrome";
import { PressableScale } from "../../src/motion/PressableScale";
import { useReducedMotion } from "../../src/motion/use-reduced-motion";
import { useTickle } from "../../src/motion/use-tickle";
import { useSession } from "../../src/state/session";
import {
  FONT_BODY,
  hueFill,
  palette,
  RADIUS_CARD,
  SPACE_16,
  SPACE_24,
  SPACE_8,
} from "../../src/theme/palette";

const ART = 96;
const HERO_MS = 900;

const heroIn = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: 14 }] },
  100: { opacity: 1, transform: [{ translateY: 0 }] },
}).duration(HERO_MS);

export default function CompanyScreen() {
  const reduced = useReducedMotion();
  const { width } = useWindowDimensions();
  const { draft, setCompanion } = useSession();
  const [companionId, setCompanionId] = useState(draft.companionId);
  const [picked, setPicked] = useState(false);
  const { tickling, tap, force } = useTickle();
  const guide = guideById(companionId);
  const tile = columnWidth(width, SPACE_24, SPACE_16);

  useOnboardingChrome({
    primary: chooseGuide(guide.name),
    primaryHaptic: "firm",
    onPrimary: () => {
      setCompanion(guide.id);
      router.push("/building");
    },
    linkLabel: skipLabel,
    onLink: () => {
      router.push("/building");
    },
    footerNote: notMedicalAdvice,
  });

  return (
    <Animated.View entering={reduced ? undefined : heroIn} style={styles.stage}>
      <View style={styles.grid}>
        {guides.map((choice) => {
          const selected = choice.id === guide.id;
          return (
            <PressableScale
              key={choice.id}
              haptic="tick"
              accessibilityLabel={choice.name}
              accessibilityState={{ selected }}
              onPress={() => {
                setPicked(true);
                setCompanionId(choice.id);
                tap();
              }}
              accessibilityActions={selected ? [{ name: "tickle", label: "Tickle" }] : undefined}
              onAccessibilityAction={(event) => {
                if (event.nativeEvent.actionName === "tickle") {
                  force();
                }
              }}
              style={{ width: tile }}
            >
              <ChoiceTile
                name={choice.name}
                selected={selected}
                tile={tile}
                hue={hueFill[choice.variant.hue]}
              >
                <CharacterMark
                  variant={choice.variant}
                  size={ART}
                  animate
                  settle={selected}
                  expression={selected ? (picked ? "celebration" : "attention") : undefined}
                  tickled={tickling && selected}
                />
              </ChoiceTile>
            </PressableScale>
          );
        })}
      </View>
      <Aside text={guide.quote} />
    </Animated.View>
  );
}

function ChoiceTile({
  name,
  selected,
  tile,
  hue,
  children,
}: {
  name: string;
  selected: boolean;
  tile: number;
  hue: string;
  children: ReactNode;
}) {
  const body = (
    <>
      {selected ? (
        <View style={styles.check}>
          <SpringCheck>
            <AppIcon name="check" color={palette.ink} size={22} />
          </SpringCheck>
        </View>
      ) : null}
      {children}
      <Text numberOfLines={1} style={styles.name}>
        {name}
      </Text>
    </>
  );
  const cardStyle = [styles.card, { width: tile, height: tile * TILE_ASPECT }];
  if (selected) {
    return (
      <GlassSurface selected interactive tint={hue} style={cardStyle}>
        {body}
      </GlassSurface>
    );
  }
  return (
    <WashCard tint={hue} style={cardStyle}>
      {body}
    </WashCard>
  );
}

const styles = StyleSheet.create({
  stage: { gap: SPACE_16 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: SPACE_16 },
  card: {
    borderRadius: RADIUS_CARD,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACE_16,
    gap: SPACE_8,
  },
  check: { position: "absolute", top: SPACE_8, right: SPACE_8 },
  name: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: FONT_BODY,
    color: palette.ink,
    textAlign: "center",
  },
});
