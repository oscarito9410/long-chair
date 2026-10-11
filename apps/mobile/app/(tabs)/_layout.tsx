import { Tabs } from "expo-router";

import { GlassTabBar } from "../../src/components/chrome/GlassTabBar";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <GlassTabBar
          state={props.state}
          navigation={{
            navigate: (name) => {
              props.navigation.navigate(name);
            },
          }}
        />
      )}
    >
      <Tabs.Screen name="kit" />
      <Tabs.Screen name="companion" />
      <Tabs.Screen name="compare" />
    </Tabs>
  );
}
