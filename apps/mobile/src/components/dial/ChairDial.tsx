import { durationChoices } from "@long-chair/core";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import Svg, { Circle, G } from "react-native-svg";

import { GlassSurface } from "../glass/GlassSurface";
import { GlassChip } from "../chrome/GlassChip";
import { PressableScale } from "../../motion/PressableScale";
import { fireHaptic } from "../../motion/haptics";
import { FONT_BODY, FONT_HERO, palette, SPACE_16, SPACE_8 } from "../../theme/palette";
import {
  DIAL_MAX,
  DIAL_MIN,
  DIAL_START,
  DIAL_TICK,
  DIAL_SWEEP,
  DIAL_TURN,
  hourFigure,
  minutesFromPoint,
} from "./dial-math";

const SIZE = 280;
const VIEW = 240;
const CENTER = 120;
const RADIUS = 92;
const RING = 14;
const HOURS = 4;

export function ChairDial({
  minutes,
  onChange,
}: {
  minutes: number;
  onChange: (value: number) => void;
}) {
  const last = useSharedValue(minutes);

  const pan = Gesture.Pan().onUpdate((event) => {
    const next = minutesFromPoint(event.x, event.y, SIZE / 2, SIZE / 2);
    if (next === last.value) {
      return;
    }
    last.value = next;
    fireHaptic("tick");
    scheduleOnRN(onChange, next);
  });

  return (
    <View style={styles.wrap}>
      <GestureDetector gesture={pan}>
        <View
          accessibilityRole="adjustable"
          accessibilityLabel="Hours in the chair"
          accessibilityValue={{ min: DIAL_MIN, max: DIAL_MAX, now: minutes }}
          accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
          onAccessibilityAction={(event) => {
            const step = event.nativeEvent.actionName === "increment" ? DIAL_TICK : -DIAL_TICK;
            onChange(Math.min(DIAL_MAX, Math.max(DIAL_MIN, minutes + step)));
          }}
          style={styles.face}
        >
          <DialArc minutes={minutes} />
          <GlassSurface style={styles.readout} tint={palette.card}>
            <Text style={styles.figure}>{hourFigure(minutes)}</Text>
            <Text style={styles.unit}>hours</Text>
            <Text style={styles.unit}>This chair</Text>
          </GlassSurface>
        </View>
      </GestureDetector>
      <View style={styles.pills}>
        {durationChoices.map((choice) => (
          <PressableScale
            key={choice.minutes}
            haptic="tick"
            onPress={() => {
              last.value = choice.minutes;
              onChange(choice.minutes);
            }}
          >
            <GlassChip
              label={choice.label}
              tint={palette.seaglass}
              selected={minutes === choice.minutes}
            />
          </PressableScale>
        ))}
      </View>
    </View>
  );
}

function DialArc({ minutes }: { minutes: number }) {
  const circumference = 2 * Math.PI * RADIUS;
  const full = circumference * (DIAL_SWEEP / DIAL_TURN);
  const dash = full * (minutes / DIAL_MAX);
  return (
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${VIEW} ${VIEW}`}>
      <G transform={`rotate(${DIAL_START} ${CENTER} ${CENTER})`}>
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke={palette.card}
          strokeWidth={RING}
          strokeLinecap="round"
          strokeDasharray={`${full} ${circumference}`}
          fill="none"
        />
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          stroke={palette.seaglassDeep}
          strokeWidth={RING}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          fill="none"
        />
      </G>
      {[1, 2, 3, HOURS].map((hour) => {
        const spot = tickPoint(hour);
        const selected = hour * DIAL_MIN === minutes;
        return (
          <Circle
            key={hour}
            cx={spot.x}
            cy={spot.y}
            r={selected ? 8 : 5}
            fill={selected ? palette.ink : palette.card}
            stroke={palette.ink}
            strokeWidth={2}
          />
        );
      })}
    </Svg>
  );
}

function tickPoint(hour: number): { x: number; y: number } {
  const angle = ((DIAL_START + (hour / HOURS) * DIAL_SWEEP) * Math.PI) / DIAL_TURN;
  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
  };
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: SPACE_16 },
  face: { width: SIZE, height: SIZE, alignItems: "center", justifyContent: "center" },
  readout: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  figure: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_HERO, color: palette.ink },
  unit: { fontFamily: "Nunito_700Bold", fontSize: FONT_BODY, color: palette.ink },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: SPACE_8, justifyContent: "center" },
});
