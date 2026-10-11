import { NativeTabs } from "expo-router/unstable-native-tabs";

import { tabs } from "../../src/copy/phrases";
import { palette } from "../../src/theme/palette";

export { ErrorBoundary } from "../../src/components/chrome/RecoveryScreen";

const label = {
  default: { color: palette.inkSoft },
  selected: { color: palette.ink },
};

export default function TabLayout() {
  return (
    <NativeTabs
      tintColor={palette.ink}
      iconColor={{ default: palette.inkSoft, selected: palette.ink }}
      labelStyle={label}
      minimizeBehavior="onScrollDown"
      disableIndicator
    >
      <NativeTabs.Trigger name="kit">
        <NativeTabs.Trigger.Label>{tabs.kit}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "rectangle.stack", selected: "rectangle.stack.fill" }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="companion">
        <NativeTabs.Trigger.Label>{tabs.companion}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "person.2", selected: "person.2.fill" }} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="compare">
        <NativeTabs.Trigger.Label>{tabs.compare}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "square.split.2x1", selected: "square.split.2x1.fill" }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
