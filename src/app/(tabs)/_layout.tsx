import {
  InlineMiniPlayer,
  FloatingMiniPlayer,
} from "@/components/miniplayer";
import {
  createNativeBottomTabNavigator,
  NativeBottomTabNavigationOptions,
  NativeBottomTabNavigationEventMap,
} from "@bottom-tabs/react-navigation";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { Platform } from "react-native";
import { TabBarHeightProvider } from "@/providers/tabBarHeight-provider";
import { useTheme } from "@/providers/theme-provider";
import { StatusBar } from "expo-status-bar";

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

export const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <TabBarHeightProvider>
      <Tabs
        minimizeBehavior="onScrollDown"
        renderBottomAccessoryView={() => <InlineMiniPlayer />}
        tabBarActiveTintColor={colors.accent}
        activeIndicatorColor={colors.background}
        tabBarStyle={{ backgroundColor: colors.surface }}
        screenOptions={{
          sceneStyle: { backgroundColor: colors.background },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Stations",
            tabBarIcon: () =>
              Platform.OS === "ios"
                ? { sfSymbol: "antenna.radiowaves.left.and.right" }
                : require("../../../assets/icons/radio-tower-1019-svgrepo-com.svg"),
          }}
        />
        <Tabs.Screen
          name="programs"
          options={{
            title: "Programs",
            tabBarIcon: () =>
              Platform.OS === "ios"
                ? { sfSymbol: "mic.fill" }
                : require("../../../assets/icons/microphone-934-svgrepo-com.svg"),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            role: "search",
            tabBarIcon: () =>
              Platform.OS === "ios"
                ? { sfSymbol: "magnifyingglass" }
                : require("../../../assets/icons/search-left-1506-svgrepo-com.svg"),
          }}
        />
      </Tabs>
      <StatusBar style="auto" />
      {Platform.OS === "android" ? <FloatingMiniPlayer /> : null}
    </TabBarHeightProvider>
  );
}
