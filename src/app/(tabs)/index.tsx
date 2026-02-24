import { STATION_DATA } from "@/api/music-stations";
import StationList from "@/components/station-list";
import { useTheme } from "@/providers/theme-provider";
import React from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const inset = useSafeAreaInsets();
  const STATIONS = STATION_DATA;
  const { animatedColors } = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedColors.background.value,
  }));

  return (
    <Animated.View
      style={[{ flex: 1, padding: 4, marginTop: inset.top }, animatedStyle]}
    >
      <StationList data={STATIONS} />
    </Animated.View>
  );
}
