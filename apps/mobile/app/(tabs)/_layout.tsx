import { NativeTabs } from "expo-router/unstable-native-tabs";

import { tabs } from "../../src/copy/phrases";
import { palette } from "../../src/theme/palette";

export default function TabLayout() {
  return (
    <NativeTabs tintColor={palette.ink} disableIndicator>
      <NativeTabs.Trigger name="kit">
        <NativeTabs.Trigger.Label>{tabs.kit}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="square.stack.3d.up.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="companion">
        <NativeTabs.Trigger.Label>{tabs.companion}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.2.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="compare">
        <NativeTabs.Trigger.Label>{tabs.compare}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="rectangle.split.2x1" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
