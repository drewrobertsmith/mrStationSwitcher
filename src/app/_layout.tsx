import { MiniPlayer } from "@/components/miniplayer";
import {
  createNativeBottomTabNavigator,
  NativeBottomTabNavigationOptions,
  NativeBottomTabNavigationEventMap,
} from "@bottom-tabs/react-navigation";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { Platform } from "react-native";
import { TabBarHeightProvider } from "@/providers/tabBarHeight-provider";
import { AudioProvider, useAudio } from "@/providers/audio-provider";

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

export const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

function TabLayout() {
  const { currentTrack } = useAudio();

  return (
    <TabBarHeightProvider>
      <Tabs
        minimizeBehavior="onScrollDown"
        renderBottomAccessoryView={({ placement }) => (
          <MiniPlayer placement={placement} />
        )}
        tabBarActiveTintColor={
          currentTrack ? currentTrack?.accentColor : undefined
        }
        tabBarInactiveTintColor={
          currentTrack ? currentTrack?.accentColor : undefined
        }
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
      {Platform.OS === "android" ? <MiniPlayer /> : null}
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
