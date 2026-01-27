import { useTabBarHeight } from "@/providers/tabBarHeight-provider";
import { Station } from "@/types/types";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform, StyleSheet, Text, View } from "react-native";

type MiniPlayerProps = {
  activeStation?: Station | null;
  placement?: "inline" | "expanded" | "none";
};

const MINI_PLAYER_HEIGHT = 64;

export function MiniPlayer({ activeStation, placement }: MiniPlayerProps) {
  const { tabBarHeight } = useTabBarHeight();
  const isAndroid = Platform.OS === "android";
  const isInline = placement === "inline";

  return (
    <View
      style={[
        isAndroid && {
          position: "absolute",
          height: MINI_PLAYER_HEIGHT,
          left: 8,
          right: 8,
          bottom: tabBarHeight + 8,
          borderWidth: 1,
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
        },
        !isAndroid && {
          justifyContent: "center",
          flex: 1,
          alignItems: "center",
        },
      ]}
    >
      <Text>{isInline ? "Mini" : "Now Playing - Full Width"}</Text>
    </View>
  );
}
