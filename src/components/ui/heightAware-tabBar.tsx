import { useTabBarHeight } from "@/providers/tabBarHeight-provider";
import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useCallback } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { useBottomTabBarHeight } from "react-native-bottom-tabs";

// This component is a bottom tab bar that reports the tabBarHeight from the native layout event up to a context so the sibling player component can consume the tab height even when outside the tab tree. This works becasue onLayout fires asynchronously AFTER the yoga layout engine calculates the position and size of the view, but BEFORE painting to the screen

// - Render: React renders <HeightAwareTabBar>.
//
// - Child Render: It renders the <View> containing the <BottomTabBar>.
//
// - Calculation: The Native layout engine calculates this tab bar needs to be N pixels tall based on the icons and safe area.
//
// - Event: The <View> stretches to N pixels. It fires onLayout with { height: N }.
//
// - Logic: handleLayout runs. It sees N. It checks context (currently 0). N !== 0, so it calls setTabBarHeight(N).
//
// - Update: The Context updates. <Player> component (listening to context) re-renders and positions itself N pixels from the bottom.

export default function HeightAwareTabBar(props: BottomTabBarProps) {
  const { tabBarHeight, setTabBarHeight } = useTabBarHeight();
  const alternativeTabBarHeight = useBottomTabBarHeight();

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height > 0 && height !== tabBarHeight) {
        setTabBarHeight(height);
      }
    },
    [setTabBarHeight, tabBarHeight],
  );

  return (
    <View onLayout={handleLayout}>
      <BottomTabBar {...props} />
    </View>
  );
}
