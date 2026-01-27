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

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

export default function RootLayout() {
  return (
    <Tabs>
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
  );
}
