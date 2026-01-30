import {
  InlineMiniPlayer,
  FloatingMiniPlayer,
} from "@/components/miniplayer";
import {
  createNativeBottomTabNavigator,
  NativeBottomTabNavigationOptions,
  NativeBottomTabNavigationEventMap,
} from "@bottom-tabs/react-navigation";
import { useResolveClassNames } from "uniwind";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { Platform } from "react-native";
import { TabBarHeightProvider } from "@/providers/tabBarHeight-provider";
import { AudioProvider } from "@/providers/audio-provider";
import { StatusBar } from "expo-status-bar";
import "../global.css";

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

export const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

function TabLayout() {
  const tabStyle = useResolveClassNames("bg-background-dark");
  const headerStyle = useResolveClassNames("bg-background-dark");

  return (
    <TabBarHeightProvider>
      <Tabs
        minimizeBehavior="onScrollDown"
        renderBottomAccessoryView={() => <InlineMiniPlayer />}
        screenOptions={{
          sceneStyle: headerStyle,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Stations",
            tabBarIcon: () =>
              Platform.OS === "ios"
                ? { sfSymbol: "antenna.radiowaves.left.and.right" }
                : require("../../assets/icons/radio-tower-1019-svgrepo-com.svg"),
          }}
        />
        <Tabs.Screen
          name="programs"
          options={{
            title: "Programs",
            tabBarIcon: () =>
              Platform.OS === "ios"
                ? { sfSymbol: "mic.fill" }
                : require("../../assets/icons/microphone-934-svgrepo-com.svg"),
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
                : require("../../assets/icons/search-left-1506-svgrepo-com.svg"),
          }}
        />
      </Tabs>
      <StatusBar style="auto" />
      {Platform.OS === "android" ? <FloatingMiniPlayer /> : null}
    </TabBarHeightProvider>
  );
}

export default function RootLayout() {
  return (
    <AudioProvider>
      <TabLayout />
    </AudioProvider>
  );
}
