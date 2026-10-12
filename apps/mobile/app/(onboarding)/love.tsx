import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import {
  canContinueTastes,
  regionCodes,
  regionMenuLabel,
  regionNames,
  tasteContinueLabel,
  tasteDisplayName,
  tasteNeedMore,
} from "@long-chair/core";
import { router } from "expo-router";

import { LoveFooter, LoveHeader } from "../../src/components/taste/LoveChrome";
import { TastePicker } from "../../src/components/taste/TastePicker";
import { showKit } from "../../src/navigation/present-sheet";
import { useSession } from "../../src/state/session";
import { useRegionGroups } from "../../src/state/use-region";
import { FONT_BODY, palette, RADIUS_CARD, SPACE_8, SPACE_16, SPACE_24, TARGET } from "../../src/theme/palette";

const FOOTER_FALLBACK = 180;

function pickNotice(ids: readonly string[]): string {
  const names = ids.map((id) => tasteDisplayName(id));
  const list = names.length > 0 ? names.join(", ") : "No tastes yet";
  return `${list}. ${tasteContinueLabel(ids.length)}.`;
}

function bumped(previous: string, message: string): string {
  return previous.endsWith("\u200b") ? message : `${message}\u200b`;
}

function RegionMenu({
  open,
  selected,
  onClose,
  onChoose,
}: {
  open: boolean;
  selected: string;
  onClose: () => void;
  onChoose: (code: (typeof regionCodes)[number]) => void;
}) {
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.scrim}>
        <Pressable style={styles.scrimFill} accessibilityLabel="Close region" onPress={onClose} />
        <View style={styles.menu}>
          <Text style={styles.menuTitle}>{regionMenuLabel}</Text>
          {regionCodes.map((code) => (
            <Pressable
              key={code}
              accessibilityRole="button"
              accessibilityState={{ selected: code === selected }}
              style={styles.option}
              onPress={() => {
                onChoose(code);
              }}
            >
              <Text style={styles.optionText}>{regionNames[code]}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

export default function LoveScreen() {
  const { draft, setSeeds, reset } = useSession();
  const region = useRegionGroups();
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
          groups={region.groups}
          regionName={region.regionName}
          onOpenRegion={() => {
            region.setOpen(true);
          }}
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
      <RegionMenu
        open={region.open}
        selected={region.region}
        onClose={() => {
          region.setOpen(false);
        }}
        onChoose={region.choose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  fill: { flex: 1 },
  live: { position: "absolute", width: 1, height: 1, overflow: "hidden" },
  scrim: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(28, 25, 22, 0.28)" },
  scrimFill: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
  menu: {
    margin: SPACE_24,
    borderRadius: RADIUS_CARD,
    backgroundColor: palette.card,
    padding: SPACE_16,
    gap: SPACE_8,
  },
  menuTitle: { fontFamily: "Nunito_800ExtraBold", fontSize: FONT_BODY, color: palette.ink },
  option: { minHeight: TARGET, justifyContent: "center" },
  optionText: { fontFamily: "Nunito_700Bold", fontSize: FONT_BODY, color: palette.ink },
});
