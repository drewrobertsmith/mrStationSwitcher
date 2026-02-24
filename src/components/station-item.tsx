import { useAudio } from "@/providers/audio-provider";
import { useSweep } from "@/providers/sweep-provider";
import { useTheme } from "@/providers/theme-provider";
import { Station } from "@/types/types";
import { stationAccentColor } from "@/utils/color";
import { memo, useEffect, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type StationItemType = {
  item: Station;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function StationItem({ item }: StationItemType) {
  const { state, actions } = useAudio();
  const { mode, colors } = useTheme();
  const { triggerSweep } = useSweep();

  const isSelected = state.currentTrack?.id === item.tritonId;
  const accentColor = item.accentColor
    ? stationAccentColor(item.accentColor, mode)
    : colors.accent;

  // Ref to measure screen position for the sweep origin
  const viewRef = useRef<View>(null);

  // Press scale
  const pressScale = useSharedValue(1);
  // 0 = neutral, 1 = selected accent
  const selectionProgress = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    selectionProgress.value = withTiming(isSelected ? 1 : 0, { duration: 400 });
    if (isSelected) {
      pressScale.value = withSpring(1.02, { damping: 12, stiffness: 280 }, () => {
        pressScale.value = withSpring(1, { damping: 14, stiffness: 200 });
      });
    }
  }, [isSelected]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      selectionProgress.value,
      [0, 1],
      [colors.text, accentColor as string],
    ),
  }));

  const handlePress = () => {
    // Measure the item's screen position and fire the sweep from its center
    viewRef.current?.measure((_x, _y, _w, h, _pageX, pageY) => {
      triggerSweep(pageY + h / 2, accentColor as string);
    });
    actions.play(item);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onLongPress={() => actions.pause()}
      onPressIn={() => {
        pressScale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
      }}
      onPressOut={() => {
        pressScale.value = withSpring(1, { damping: 12, stiffness: 300 });
      }}
      style={containerStyle}
    >
      <View ref={viewRef} style={styles.container} collapsable={false}>
        <Animated.Text style={[styles.nameText, textStyle]}>
          {item.frequency ? `${item.frequency} - ${item.name}` : item.name}
        </Animated.Text>
      </View>
    </AnimatedPressable>
  );
}

export default memo(StationItem);

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  nameText: {
    fontSize: 48,
    fontWeight: "600",
  },
});
