import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  canContinueTastes,
  tasteContinueLabel,
  tasteDisplayName,
  tasteNeedMore,
} from "@long-chair/core";
import { router } from "expo-router";

import { LoveFooter, LoveHeader } from "../../src/components/taste/LoveChrome";
import { TastePicker } from "../../src/components/taste/TastePicker";
import { showKit } from "../../src/navigation/present-sheet";
import { useSession } from "../../src/state/session";

const FOOTER_FALLBACK = 180;

function pickNotice(ids: readonly string[]): string {
  const names = ids.map((id) => tasteDisplayName(id));
  const list = names.length > 0 ? names.join(", ") : "No tastes yet";
  return `${list}. ${tasteContinueLabel(ids.length)}.`;
}

function bumped(previous: string, message: string): string {
  return previous.endsWith("\u200b") ? message : `${message}\u200b`;
}

export default function LoveScreen() {
  const { draft, setSeeds, reset } = useSession();
  const [footerHeight, setFooterHeight] = useState(FOOTER_FALLBACK);
  const [notice, setNotice] = useState("");
  const count = draft.seedIds.length;
  const ready = canContinueTastes(count);

  function apply(next: readonly string[]) {
    const same =
      next.length === draft.seedIds.length && next.every((id, index) => id === draft.seedIds[index]);
    if (same) {
      return;
    }
    setSeeds(next);
    setNotice(pickNotice(next));
  }

  return (
    <View style={styles.screen}>
      <LoveHeader />
      <View style={styles.fill}>
        <TastePicker
          selectedIds={draft.seedIds}
          footerClearance={footerHeight}
          onApply={apply}
        />
        <LoveFooter
          label={tasteContinueLabel(count)}
          ready={ready}
          onHeight={setFooterHeight}
          onSample={() => {
            reset();
            setTimeout(() => {
              showKit();
            }, 0);
          }}
          onContinue={() => {
            if (!ready) {
              setNotice((current) => bumped(current, tasteNeedMore(count)));
              return;
            }
            router.push("/chair");
          }}
        />
      </View>
      <Text accessibilityLiveRegion="polite" style={styles.live}>
        {notice}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  fill: { flex: 1 },
  live: { position: "absolute", width: 1, height: 1, overflow: "hidden" },
});
