import { useTheme } from "@/providers/theme-provider";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

function FloatingMic({ color }: { color: string }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1200 }),
        withTiming(0, { duration: 1200 }),
      ),
      -1,
      true,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.iconContainer, style]}>
      <FontAwesome5 name="microphone-alt" size={64} color={color} />
    </Animated.View>
  );
}

function NudgingArrow({ color }: { color: string }) {
  const nudge = useSharedValue(0);

  useEffect(() => {
    nudge.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 600 }),
        withTiming(0, { duration: 600 }),
      ),
      -1,
      true,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: nudge.value }],
  }));

  return (
    <Animated.View style={[styles.arrowContainer, style]}>
      <FontAwesome5 name="arrow-left" size={14} color={color} />
      <Text style={[styles.arrowText, { color }]}>
        tune in from the Stations tab
      </Text>
    </Animated.View>
  );
}

export default function ProgramsTab() {
  const { colors } = useTheme();

  const contentOpacity = useSharedValue(0);
  const contentScale = useSharedValue(0.9);

  useEffect(() => {
    contentOpacity.value = withTiming(1, { duration: 500 });
    contentScale.value = withSpring(1, { damping: 18, stiffness: 160 });
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ scale: contentScale.value }],
  }));

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.content, containerStyle]}>
        <FloatingMic color={colors.accent} />
        <Text style={[styles.headline, { color: colors.text }]}>
          Your Program Guide
        </Text>
        <Text style={[styles.subtext, { color: colors.text }]}>
          Program listings are coming soon.{"\n"}
          Pick a station and start listening now.
        </Text>
        <NudgingArrow color={colors.accent} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 8,
  },
  headline: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  subtext: {
    fontSize: 15,
    opacity: 0.6,
    textAlign: "center",
    lineHeight: 22,
  },
  arrowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  arrowText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
