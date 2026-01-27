import { MiniPlayer } from "@/components/miniplayer";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import {
  createNativeBottomTabNavigator,
  NativeBottomTabNavigationOptions,
  NativeBottomTabNavigationEventMap,
} from "@bottom-tabs/react-navigation";
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { Platform } from "react-native";
import { TabBarHeightProvider } from "@/providers/tabBarHeight-provider";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import HeightAwareTabBar from "@/components/ui/heightAware-tabBar";

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

export default function RootLayout() {
  return (
    <TabBarHeightProvider>
      <Tabs
        tabBar={(props: BottomTabBarProps) => <HeightAwareTabBar {...props} />}
        minimizeBehavior="onScrollDown"
        renderBottomAccessoryView={({ placement }) => (
          <MiniPlayer placement={placement} />
        )}
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
      </Tabs>
      {Platform.OS === "android" ? <MiniPlayer /> : null}
    </TabBarHeightProvider>
  );
}
