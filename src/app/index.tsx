import { STATION_DATA } from "@/api/stations";
import StationList from "@/components/station-list";
import { useTheme } from "@/providers/theme-provider";
import React from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const inset = useSafeAreaInsets();
  const STATIONS = STATION_DATA;
  const { colors } = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(colors.background, { duration: 400 }),
    };
  });

  return (
    <Animated.View
      style={[
        { flex: 1, padding: 4, marginTop: inset.top },
        animatedStyle,
      ]}
    >
      <StationList data={STATIONS} />
    </Animated.View>
  );
}
